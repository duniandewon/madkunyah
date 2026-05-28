import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const menusTable = pgTable(
  "menus",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    category: varchar({ length: 255 }).notNull(),
    price: integer().notNull(),
    image: varchar({ length: 255 }),
    isAvailable: boolean().notNull().default(true),
  },
  (t) => [
    index("category_idx").on(t.category),
    index("menu_name_idx").on(t.name),
  ],
);

export const modifierGroupTable = pgTable(
  "modifier_group",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 255 }).notNull(),
    minSelect: integer().default(0),
    maxSelect: integer().default(1),
  },
  (t) => [index("group_name_idx").on(t.name)],
);

export const modifierItemTable = pgTable(
  "modfier_item",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    price: integer().notNull(),
    modifierGroupId: integer("modifier_group_id")
      .notNull()
      .references(() => modifierGroupTable.id),
  },
  (t) => [index("item_group_id_idx").on(t.modifierGroupId)],
);

export const menusToModifierGroupsTable = pgTable(
  "menus_to_modifier_groups",
  {
    menuId: integer("menu_id")
      .notNull()
      .references(() => menusTable.id),
    modifierGroupId: integer("modifier_group_id")
      .notNull()
      .references(() => modifierGroupTable.id),
  },
  (t) => [
    primaryKey({ columns: [t.menuId, t.modifierGroupId] }),
    index("menu_id_idx").on(t.menuId),
    index("modifier_group_id_idx").on(t.modifierGroupId),
  ],
);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "expired",
]);

export const fulfillmentStatusEnum = pgEnum("fulfillment_status", [
  "new",
  "preparing",
  "delivering",
  "completed",
  "canceled",
]);

export const ordersTable = pgTable(
  "orders",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id"),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
    deliveryAddress: text("delivery_address").notNull(),
    orderTotal: integer("order_total").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").notNull(),
    fulfillmentStatus: fulfillmentStatusEnum("fulfillment_status").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_orders_user_id").on(t.userId),
    index("idx_orders_customer_name").on(t.customerName),
    index("idx_orders_customer_phone").on(t.customerPhone),
  ],
);

export const orderItemsTable = pgTable(
  "order_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer("order_id").notNull(),
    menuId: integer("menu_id").notNull(),
    menuNameSnapshot: varchar("menu_name_snapshot", { length: 255 }).notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    itemTotal: integer("item_total").notNull(),
  },
  (t) => [
    index("idx_order_items_order_id").on(t.orderId),
    foreignKey({
      columns: [t.orderId],
      foreignColumns: [ordersTable.id],
      name: "fk_order",
    }).onDelete("cascade"),
    check("quantity_check", sql`${t.quantity} > 0`),
  ],
);

export const orderItemModifiersTable = pgTable(
  "order_item_modifiers",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderItemId: integer("order_item_id").notNull(),
    modifierGroupNameSnapshot: varchar("modifier_group_name_snapshot", {
      length: 255,
    }).notNull(),
    modifierItemNameSnapshot: varchar("modifier_item_name_snapshot", {
      length: 255,
    }).notNull(),
    modifierPrice: integer("modifier_price").notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (t) => [
    index("idx_order_item_modifiers_order_item_id").on(t.orderItemId),
    foreignKey({
      columns: [t.orderItemId],
      foreignColumns: [orderItemsTable.id],
      name: "fk_order_item",
    }).onDelete("cascade"),
    check("modifier_quantity_check", sql`${t.quantity} > 0`),
  ],
);

export const paymentsTable = pgTable(
  "payments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer("order_id")
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),
    externalId: varchar("external_id", { length: 255 }).notNull().unique(),
    gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }),
    gatewayName: varchar("gateway_name", { length: 50 }).notNull(),
    amount: integer("amount").notNull(),
    paymentChannel: varchar("payment_channel", { length: 50 }),
    status: paymentStatusEnum("status").notNull().default("pending"),
    paidAt: timestamp("paid_at"),
    expiryAt: timestamp("expire_time"),
    paymentLink: text("payment_link"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("idx_payments_external_id").on(t.externalId)],
);

/**
 * Relations
 */

export const menusRelations = relations(menusTable, ({ many }) => ({
  modifierGroups: many(menusToModifierGroupsTable),
}));

export const modifierGroupRelations = relations(
  modifierGroupTable,
  ({ many }) => ({
    menus: many(menusToModifierGroupsTable),
    items: many(modifierItemTable),
  }),
);

export const menusToModifierGroupsRelations = relations(
  menusToModifierGroupsTable,
  ({ one }) => ({
    menu: one(menusTable, {
      fields: [menusToModifierGroupsTable.menuId],
      references: [menusTable.id],
    }),
    modifierGroup: one(modifierGroupTable, {
      fields: [menusToModifierGroupsTable.modifierGroupId],
      references: [modifierGroupTable.id],
    }),
  }),
);

export const modifierItemRelations = relations(
  modifierItemTable,
  ({ one }) => ({
    group: one(modifierGroupTable, {
      fields: [modifierItemTable.modifierGroupId],
      references: [modifierGroupTable.id],
    }),
  }),
);

export const ordersRelations = relations(ordersTable, ({ many }) => ({
  orderItems: many(orderItemsTable),
  payments: many(paymentsTable),
}));

export const orderItemsRelations = relations(
  orderItemsTable,
  ({ one, many }) => ({
    order: one(ordersTable, {
      fields: [orderItemsTable.orderId],
      references: [ordersTable.id],
    }),
    modifiers: many(orderItemModifiersTable),
  }),
);

export const orderItemModifiersRelations = relations(
  orderItemModifiersTable,
  ({ one }) => ({
    orderItem: one(orderItemsTable, {
      fields: [orderItemModifiersTable.orderItemId],
      references: [orderItemsTable.id],
    }),
  }),
);

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [paymentsTable.orderId],
    references: [ordersTable.id],
  }),
}));
