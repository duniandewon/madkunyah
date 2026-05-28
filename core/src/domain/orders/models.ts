export interface CreateOrderInput {
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

export interface CreateOrderResponse {
  total: number;
  orderId: number;
  externalId: string;
}

export interface OrderItemModifier {
  id: number;
  name: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  modifiers: OrderItemModifier[];
}

export interface Order {
  id: number;
  customerName: string;
  items: OrderItem[];
}
