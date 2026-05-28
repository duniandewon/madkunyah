import {
  CreateOrderInput,
  CreateOrderResponse,
  Order,
} from "../../domain/orders/models";
import { OrderRepository } from "../../domain/orders/repository";
import { OrderDataSource } from "./datasource";

export function ORdersRepositoryImpl(data: OrderDataSource): OrderRepository {
  const getOrders = async (): Promise<Order[]> => {
    const res = await data.getOrders();

    const orders: Order[] = res.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      items: order.orderItems.map((item) => ({
        id: item.id,
        name: item.menuNameSnapshot,
        quantity: item.quantity,
        modifiers: item.modifiers.map((modifier) => ({
          id: modifier.id,
          name: modifier.modifierItemNameSnapshot,
        })),
      })),
    }));

    return orders;
  };

  const createOrder = async (
    orderInput: CreateOrderInput,
  ): Promise<CreateOrderResponse | undefined> => {
    const res = await data.createOrder({
      customer: orderInput.customer,
      items: orderInput.items,
    });

    if (!res) return;

    return {
      externalId: res.externalId,
      orderId: res.orderId,
      total: res.total,
    };
  };

  const setFulfillmentStatusDelivering = async (
    orderId: number,
  ): Promise<Order | undefined> => {
    const res = await data.setFulfillmentStatusDelivering(orderId);

    if (!res) return;

    return {
      customerName: res.customerName,
      id: res.id,
      items: res.orderItems.map((item) => ({
        id: item.id,
        modifiers: item.modifiers.map((mod) => ({
          id: mod.id,
          name: mod.modifierItemNameSnapshot,
        })),
        name: item.menuNameSnapshot,
        quantity: item.quantity,
      })),
    };
  };

  const setFulfillmentStatusCompleted = async (
    orderId: number,
  ): Promise<Order | undefined> => {
    const res = await data.setFulfillmentStatusCompleted(orderId);

    if (!res) return;

    return {
      customerName: res.customerName,
      id: res.id,
      items: res.orderItems.map((item) => ({
        id: item.id,
        modifiers: item.modifiers.map((mod) => ({
          id: mod.id,
          name: mod.modifierItemNameSnapshot,
        })),
        name: item.menuNameSnapshot,
        quantity: item.quantity,
      })),
    };
  };

  const setFulfillmentStatusCanceled = async (
    orderId: number,
  ): Promise<Order | undefined> => {
    const res = await data.setFulfillmentStatusCanceled(orderId);

    if (!res) return;

    return {
      customerName: res.customerName,
      id: res.id,
      items: res.orderItems.map((item) => ({
        id: item.id,
        modifiers: item.modifiers.map((mod) => ({
          id: mod.id,
          name: mod.modifierItemNameSnapshot,
        })),
        name: item.menuNameSnapshot,
        quantity: item.quantity,
      })),
    };
  };

  return {
    getOrders,
    createOrder,
    setFulfillmentStatusCanceled,
    setFulfillmentStatusCompleted,
    setFulfillmentStatusDelivering,
  };
}
