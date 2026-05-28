import {
  CreateOrderInput,
  CreateOrderResponse,
  Order,
} from "../../domain/orders/models";
import { OrderRepository } from "../../domain/orders/repository";
import { PaymentGateway } from "../../domain/payments/gateway";
import { PaymentRepository } from "../../domain/payments/repository";
import { ServiceResponse } from "../../shared/types/responses";

import { OrdersUseCase } from "./use-case";

export function OrdersInteractors(
  ordersRepository: OrderRepository,
  paymentRepository: PaymentRepository,
  paymentGateway: PaymentGateway,
): OrdersUseCase {
  const createOrder = async (
    orderInput: CreateOrderInput,
  ): Promise<ServiceResponse<CreateOrderResponse>> => {
    try {
      const orderResponse = await ordersRepository.createOrder(orderInput);
      if (!orderResponse)
        return {
          success: false,
          message: "Failed to create order",
          statusCode: 4000,
        };

      const paymentResponse = await paymentGateway.createTransaction({
        grossAmount: orderResponse.total,
        orderId: orderResponse.externalId,
      });

      if (!paymentResponse.isSuccess)
        return {
          success: false,
          message: "payment gateway failed",
          statusCode: 400,
        };

      const updateRes = await paymentRepository.updatePaymentData(
        orderResponse.externalId,
        {
          amount: orderResponse.total,
          expiryAt: new Date(paymentResponse.expiresAt),
          paymentChannel: paymentResponse.paymentType,
          paymentLink: paymentResponse.qrString || "",
        },
      );

      if (!updateRes) {
        return {
          success: false,
          message: "update payment failed",
          statusCode: 400,
        };
      }

      return {
        success: true,
        message: "OK",
        responseObject: orderResponse,
        statusCode: 200,
      };
    } catch (err) {
      console.log("error on create order", err);
      return {
        success: false,
        message: "Something went wrong",
        statusCode: 500,
      };
    }
  };

  const getOrders = async (): Promise<ServiceResponse<Order[]>> => {
    try {
      const res = await ordersRepository.getOrders();

      return {
        success: true,
        message: "OK",
        responseObject: res,
        statusCode: 200,
      };
    } catch (err) {
      console.log("error on get orders", err);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };

  const orderComplete = async (
    orderId: number,
  ): Promise<ServiceResponse<Order>> => {
    try {
      const order =
        await ordersRepository.setFulfillmentStatusCompleted(orderId);
      if (!order) {
        return {
          success: false,
          message: "update order failed",
          statusCode: 400,
        };
      }

      return {
        success: true,
        message: "OK",
        responseObject: order,
        statusCode: 200,
      };
    } catch (error) {
      console.log("error on order complete:", error);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };

  const orderCanceled = async (
    orderId: number,
  ): Promise<ServiceResponse<Order>> => {
    try {
      const order =
        await ordersRepository.setFulfillmentStatusCanceled(orderId);
      if (!order) {
        return {
          success: false,
          message: "update order failed",
          statusCode: 400,
        };
      }

      return {
        success: true,
        message: "OK",
        responseObject: order,
        statusCode: 200,
      };
    } catch (error) {
      console.log("error on order canceled:", error);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };

  return {
    createOrder,
    getOrders,
    orderCanceled,
    orderComplete,
  };
}
