import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { OrderDataSource } from "./datasource";
import { CreateOrderDto, CreateOrderInputDto, OrderDto } from "./dto";
import {
  orderItemModifiersTable,
  orderItemsTable,
  ordersTable,
  paymentsTable,
} from "../../platform/drizzle/schema";
import { eq } from "drizzle-orm";

export function OrdersDatasourceImpl(
  dbClient: NodePgDatabase<typeof import("../../platform/drizzle/schema")>,
): OrderDataSource {
  const getOrders = async (): Promise<OrderDto[]> => {
    const res = await dbClient.query.ordersTable.findMany({
      where: (orders, { eq, and }) =>
        and(
          eq(orders.paymentStatus, "paid"),
          eq(orders.fulfillmentStatus, "new"),
        ),
      orderBy: (orders, { desc }) => desc(orders.createdAt),
      with: {
        orderItems: {
          with: {
            modifiers: true,
          },
        },
      },
    });

    return res;
  };

  const prepareOrderData = async (menuItems: CreateOrderInputDto["items"]) => {
    const res = await dbClient.query.menusTable.findMany({
      where: (menus, { inArray }) =>
        inArray(
          menus.id,
          menuItems.map((item) => item.menuId),
        ),
      columns: {
        id: true,
        name: true,
        price: true,
      },
      with: {
        modifierGroups: {
          with: {
            modifierGroup: {
              columns: {
                name: true,
              },
              with: {
                items: {
                  where: (items, { inArray }) =>
                    inArray(
                      items.id,
                      menuItems.flatMap((item) => item.modifierItemIDs),
                    ),
                  columns: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const menuMap = new Map(res.map((m) => [m.id, m]));
    const modifierMap = new Map();
    res.forEach((m) =>
      m.modifierGroups.forEach((mg) =>
        mg.modifierGroup.items.forEach((mi) =>
          modifierMap.set(mi.id, { ...mi, groupName: mg.modifierGroup.name }),
        ),
      ),
    );

    let runningOrderTotal = 0;
    const itemsToInsert = [];

    for (const item of menuItems) {
      const menuInfo = menuMap.get(item.menuId);
      if (!menuInfo) return;

      let currentItemModifiersTotal = 0;
      const itemModifiers = [];

      for (const modId of item.modifierItemIDs) {
        const modInfo = modifierMap.get(modId);
        if (modInfo) {
          currentItemModifiersTotal += modInfo.price;
          itemModifiers.push({
            modifierGroupNameSnapshot: modInfo.groupName,
            modifierItemNameSnapshot: modInfo.name,
            modifierPrice: modInfo.price,
            quantity: 1,
          });
        }
      }

      const unitTotal = menuInfo.price + currentItemModifiersTotal;
      const itemTotal = unitTotal * item.quantity;
      runningOrderTotal += itemTotal;

      itemsToInsert.push({
        menuId: item.menuId,
        menuNameSnapshot: menuInfo.name,
        unitPrice: menuInfo.price,
        quantity: item.quantity,
        itemTotal: itemTotal,
        modifiers: itemModifiers,
      });
    }

    return { runningOrderTotal, itemsToInsert };
  };

  const createOrder = async (
    orderInput: CreateOrderInputDto,
  ): Promise<CreateOrderDto | undefined> => {
    const preparedOrders = await prepareOrderData(orderInput.items);
    if (!prepareOrderData) return;

    const { externalId, orderId, total } = await dbClient.transaction(
      async (ctx) => {
        const itemsToInsert = preparedOrders?.itemsToInsert || [];

        const [order] = await ctx
          .insert(ordersTable)
          .values({
            customerName: orderInput.customer.name,
            customerPhone: orderInput.customer.phone,
            deliveryAddress: orderInput.customer.address,
            fulfillmentStatus: "new",
            orderTotal: preparedOrders?.runningOrderTotal || 0,
            paymentStatus: "pending",
          })
          .returning({ id: ordersTable.id });

        const insertedItems = await ctx
          .insert(orderItemsTable)
          .values(
            itemsToInsert.map((item) => ({
              orderId: order.id,
              menuId: item.menuId,
              menuNameSnapshot: item.menuNameSnapshot,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              itemTotal: item.itemTotal,
            })),
          )
          .returning({ id: orderItemsTable.id });

        const modifierPayload = insertedItems.flatMap((insertedItem, index) =>
          itemsToInsert[index].modifiers.map((mod) => ({
            ...mod,
            orderItemId: insertedItem.id,
          })),
        );

        if (modifierPayload.length > 0) {
          await ctx.insert(orderItemModifiersTable).values(modifierPayload);
        }

        const externalId = `ORD-${order.id}-${Date.now()}`;
        await ctx.insert(paymentsTable).values({
          externalId,
          orderId: order.id,
          gatewayName: "MIDTRANS",
          amount: preparedOrders?.runningOrderTotal || 0,
        });

        return {
          total: preparedOrders?.runningOrderTotal || 0,
          externalId,
          orderId: order.id,
        };
      },
    );

    return { externalId, orderId, total };
  };

  const setFulfillmentStatusDelivering = async (
    orderId: number,
  ): Promise<OrderDto | undefined> => {
    await dbClient
      .update(ordersTable)
      .set({
        fulfillmentStatus: "delivering",
      })
      .where(eq(ordersTable.id, orderId));

    const order = await dbClient.query.ordersTable.findFirst({
      where: (order, { eq }) => eq(order.id, orderId),
      with: {
        orderItems: {
          with: {
            modifiers: true,
          },
        },
      },
    });

    if (!order) return;

    return order;
  };

  const setFulfillmentStatusCompleted = async (
    orderId: number,
  ): Promise<OrderDto | undefined> => {
    await dbClient
      .update(ordersTable)
      .set({
        fulfillmentStatus: "completed",
      })
      .where(eq(ordersTable.id, orderId));

    const order = await dbClient.query.ordersTable.findFirst({
      where: (order, { eq }) => eq(order.id, orderId),
      with: {
        orderItems: {
          with: {
            modifiers: true,
          },
        },
      },
    });

    if (!order) return;

    return order;
  };

  const setFulfillmentStatusCanceled = async (
    orderId: number,
  ): Promise<OrderDto | undefined> => {
    await dbClient
      .update(ordersTable)
      .set({
        fulfillmentStatus: "canceled",
      })
      .where(eq(ordersTable.id, orderId));

    const order = await dbClient.query.ordersTable.findFirst({
      where: (order, { eq }) => eq(order.id, orderId),
      with: {
        orderItems: {
          with: {
            modifiers: true,
          },
        },
      },
    });

    if (!order) return;

    return order;
  };

  return {
    setFulfillmentStatusDelivering,
    setFulfillmentStatusCompleted,
    setFulfillmentStatusCanceled,
    getOrders,
    createOrder,
  };
}
