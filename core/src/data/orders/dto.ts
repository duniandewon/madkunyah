export interface OrderDto {
  id: number;
  userId: number | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderTotal: number;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfilmentStatusDto;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemDto[];
}

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "expired";

export type OrderFulfilmentStatusDto =
  | "new"
  | "preparing"
  | "delivering"
  | "completed"
  | "canceled";

export interface OrderItemDto {
  id: number;
  menuId: number;
  orderId: number;
  menuNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
  modifiers: ModifierDto[];
}

export interface ModifierDto {
  id: number;
  quantity: number;
  orderItemId: number;
  modifierGroupNameSnapshot: string;
  modifierItemNameSnapshot: string;
  modifierPrice: number;
}

export interface CreateOrderInputDto {
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: {
    menuId: number;
    quantity: number;
    modifierItemIDs: number[];
  }[];
}

export interface CreateOrderDto {
  externalId: string;
  orderId: number;
  total: number;
}
