import { PaymentUseCase } from "@madkunyah/core";
import { Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import { env } from "@madkunyah/core";
interface MidtransWebhookBody {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status:
    | "capture"
    | "settlement"
    | "cancel"
    | "deny"
    | "expire"
    | "pending";
  fraud_status?: "accept" | "challenge" | "deny";
  transaction_id: string;
}

export class MindtransController {
  private paymentUsecase: PaymentUseCase;

  constructor(paymentUsecase: PaymentUseCase) {
    this.paymentUsecase = paymentUsecase;
  }

  midtransWebHook: RequestHandler = async (
    req: Request<{}, {}, MidtransWebhookBody>,
    res: Response,
  ) => {
    try {
      const body = req.body;

      const payload = `${body.order_id}${body.status_code}${body.gross_amount}${env.MIDTRANS_SERVER_KEY}`;

      const localSignature = crypto
        .createHash("sha512")
        .update(payload)
        .digest("hex");

      if (localSignature !== body.signature_key) {
        return res.status(401).json({ message: "Invalid Signature Key" });
      }

      const {
        order_id: externalId,
        transaction_status,
        fraud_status,
        transaction_id: gatewayTransactionId,
      } = body;

      const payment =
        await this.paymentUsecase.getPaymentByExternalId(externalId);

      if (!payment.success)
        throw new Error(`Payment record not found for: ${externalId}`);

      if (
        payment.success &&
        payment.responseObject.status === "paid" &&
        transaction_status === "settlement"
      )
        return;

      if (
        transaction_status === "capture" ||
        transaction_status === "settlement"
      ) {
        if (fraud_status === "accept" || !fraud_status) {
          this.paymentUsecase.paymentSuccess(externalId, {
            gatewayTransactionId,
            paidAt: new Date(),
          });
        }
      } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
        transaction_status === "expire"
          ? this.paymentUsecase.paymentExpired(externalId)
          : this.paymentUsecase.paymentFailed(externalId);
      }

      return res.status(200).json({ status: "OK" });
    } catch (error) {
      console.error("Webhook Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
