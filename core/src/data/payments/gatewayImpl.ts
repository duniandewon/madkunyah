import { CoreApi } from "midtrans-client";
import { TransactionResponseMidtrans } from "./dtos";
import { PaymentGateway } from "../../domain/payments/gateway";
import {
  PaymentTransactionData,
  PaymentTransactionResult,
} from "../../domain/payments/models";

export function GatewayImpl(client: CoreApi): PaymentGateway {
  const createTransaction = async (
    data: PaymentTransactionData,
  ): Promise<PaymentTransactionResult> => {
    try {
      const payload = {
        payment_type: "qris",
        transaction_details: {
          order_id: data.orderId,
          gross_amount: data.grossAmount,
        },
        qris: { acquirer: "gopay" },
      };

      const response = (await client.charge(
        payload,
      )) as TransactionResponseMidtrans;
      return {
        isSuccess: response.status_code === "201",
        transactionId: response.transaction_id,
        status: response.transaction_status,
        qrString: response.actions.find((a) => a.name === "generate-qr-code")
          ?.url,
        actions: response.actions,
        expiresAt: response.expiry_time,
        paymentType: response.payment_type,
      };
    } catch (err) {
      console.error("Midtrans Core API Error:", err);
      throw new Error("Failed to create QRIS transaction");
    }
  };

  return {
    createTransaction,
  };
}
