import { Payment, SetPaymentPaid } from "../../domain/payments/models";
import { PaymentRepository } from "../../domain/payments/repository";
import { ServiceResponse } from "../../shared/types/responses";
import { PaymentUseCase } from "./use-case";

export function PaymentsInteractors(
  paymentRepository: PaymentRepository,
): PaymentUseCase {
  const getPaymentByExternalId = async (
    externalId: string,
  ): Promise<ServiceResponse<Payment>> => {
    try {
      const res = await paymentRepository.getPaymentsByExternalId(externalId);
      if (!res) {
        return {
          success: false,
          message: "not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        message: "OK",
        responseObject: res,
        statusCode: 200,
      };
    } catch (err) {
      console.log("error on get payment by external id:", err);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };

  const paymentSuccess = async (
    externalId: string,
    data: SetPaymentPaid,
  ): Promise<ServiceResponse<Payment>> => {
    try {
      const payment = await paymentRepository.setPaymentPaid(externalId, data);
      if (!payment) {
        return {
          success: false,
          message: "payment failed",
          statusCode: 400,
        };
      }

      return {
        success: true,
        message: "OK",
        responseObject: {
          amount: payment.amount,
          expiryAt: payment.expiryAt,
          externalId: payment.externalId,
          id: payment.id,
          orderId: payment.orderId,
          paymentLink: payment.paymentLink,
          status: payment.status,
        },
        statusCode: 200,
      };
    } catch (error) {
      console.log("error on payment success:", error);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };

  const paymentFailed = async (
    externalId: string,
  ): Promise<ServiceResponse<null>> => {
    try {
      const payment = await paymentRepository.setPaymentFailed(externalId);
      if (!payment) {
        return {
          success: false,
          message: "update payment failed",
          statusCode: 400,
        };
      }

      return {
        success: true,
        message: "OK",
        responseObject: null,
        statusCode: 200,
      };
    } catch (error) {
      console.log("error on payment failed:", error);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };

  const paymentExpired = async (
    externalId: string,
  ): Promise<ServiceResponse<null>> => {
    try {
      const payment = await paymentRepository.setPaymentExpired(externalId);
      if (!payment) {
        return {
          success: false,
          message: "update payment failed",
          statusCode: 400,
        };
      }

      return {
        success: true,
        message: "OK",
        responseObject: null,
        statusCode: 200,
      };
    } catch (error) {
      console.log("error on payment expired:", error);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };

  return {
    paymentSuccess,
    paymentExpired,
    paymentFailed,
    getPaymentByExternalId,
  };
}
