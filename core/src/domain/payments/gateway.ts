import { PaymentTransactionData, PaymentTransactionResult } from "./models";

export interface PaymentGateway {
  createTransaction(
    data: PaymentTransactionData,
  ): Promise<PaymentTransactionResult>;
}
