export interface PaymentDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  orderId: number;
  externalId: string;
  gatewayTransactionId: string | null;
  gatewayName: string;
  amount: number;
  paymentChannel: string | null;
  status: "pending" | "paid" | "failed" | "expired";
  paidAt: Date | null;
  expiryAt: Date | null;
  paymentLink: string | null;
}

export interface UpdatePaymentDto {
  paymentChannel: string;
  amount: number;
  expiryAt: Date;
  paymentLink: string;
}

export interface SetPaymentPaidDto {
  gatewayTransactionId: string;
  paidAt: Date;
}

export interface TransactionResponseMidtrans {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: Date;
  transaction_status: string;
  fraud_status: string;
  acquirer: string;
  actions: Action[];
  qr_string: string;
  expiry_time: Date;
}

interface Action {
  name: string;
  method: string;
  url: string;
}
