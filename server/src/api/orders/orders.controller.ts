import {
  CreateOrderInput,
  CreateOrderResponse,
  Order,
  OrdersUseCase,
  ServiceResponse,
} from "@madkunyah/core";
import { Request, RequestHandler, Response } from "express";

export class OrdersController {
  private ordersUseCase: OrdersUseCase;

  constructor(ordersUseCase: OrdersUseCase) {
    this.ordersUseCase = ordersUseCase;
  }

  getOrders: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse: ServiceResponse<Order[]> =
      await this.ordersUseCase.getOrders();

    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  createOrder: RequestHandler = async (
    req: Request<{}, {}, CreateOrderInput>,
    res: Response,
  ) => {
    const serviceResponse: ServiceResponse<CreateOrderResponse> =
      await this.ordersUseCase.createOrder(req.body);

    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}
