import { CreateOrderInput, CreateOrderResponse, Order } from "./models";

export interface OrderRepository {
  getOrders(): Promise<Order[]>;
  createOrder(
    orderInput: CreateOrderInput,
  ): Promise<CreateOrderResponse | undefined>;

  setFulfillmentStatusDelivering(orderId: number): Promise<Order | undefined>;
  setFulfillmentStatusCompleted(orderId: number): Promise<Order | undefined>;
  setFulfillmentStatusCanceled(orderId: number): Promise<Order | undefined>;
}
