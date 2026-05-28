type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface Payment {
  id: number;
  status: PaymentStatus;
  orderId: number;
  externalId: string;
  amount: number;
  expiryAt: Date | null;
  paymentLink: string | null;
}

export interface PaymentTransactionData {
  orderId: string;
  grossAmount: number;
}

export interface PaymentTransactionResult {
  isSuccess: boolean;
  transactionId: string;
  status: string;
  qrString?: string;
  actions?: Array<{ name: string; method: string; url: string }>;
  expiresAt: Date;
  paymentType: string;
}

export interface UpdatePayment {
  paymentChannel: string;
  amount: number;
  expiryAt: Date;
  paymentLink: string;
}

export interface SetPaymentPaid {
  gatewayTransactionId: string;
  paidAt: Date;
}
