import { Payment, SetPaymentPaid, UpdatePayment } from "./models";

export interface PaymentRepository {
  getPaymentsByExternalId(extternalId: string): Promise<Payment | undefined>;
  updatePaymentData(
    externalId: string,
    data: UpdatePayment,
  ): Promise<Payment | undefined>;
  setPaymentPaid(
    externalId: string,
    data: SetPaymentPaid,
  ): Promise<Payment | undefined>;
  setPaymentFailed(externalId: string): Promise<Payment | undefined>;
  setPaymentExpired(externalId: string): Promise<Payment | undefined>;
}
