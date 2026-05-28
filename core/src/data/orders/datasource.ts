import { CreateOrderDto, CreateOrderInputDto, OrderDto } from "./dto";

export interface OrderDataSource {
  getOrders(): Promise<OrderDto[]>;
  createOrder(
    orderInput: CreateOrderInputDto,
  ): Promise<CreateOrderDto | undefined>;

  setFulfillmentStatusDelivering(
    orderId: number,
  ): Promise<OrderDto | undefined>;
  setFulfillmentStatusCompleted(orderId: number): Promise<OrderDto | undefined>;
  setFulfillmentStatusCanceled(orderId: number): Promise<OrderDto | undefined>;
}
