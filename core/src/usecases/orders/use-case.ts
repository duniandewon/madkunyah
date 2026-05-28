import {
  CreateOrderInput,
  CreateOrderResponse,
  Order,
} from "../../domain/orders/models";
import { ServiceResponse } from "../../shared/types/responses";

export interface OrdersUseCase {
  getOrders(): Promise<ServiceResponse<Order[]>>;
  createOrder(
    orderInput: CreateOrderInput,
  ): Promise<ServiceResponse<CreateOrderResponse>>;
  orderComplete(orderId: number): Promise<ServiceResponse<Order>>;
  orderCanceled(orderId: number): Promise<ServiceResponse<Order>>;
}
