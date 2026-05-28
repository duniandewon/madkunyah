import { PaymentDto, SetPaymentPaidDto, UpdatePaymentDto } from "./dtos";

export interface PaymentDataSource {
  updatePaymentData(
    externalId: string,
    data: UpdatePaymentDto,
  ): Promise<PaymentDto | undefined>;
  setPaymentPaid(
    externalId: string,
    data: SetPaymentPaidDto,
  ): Promise<PaymentDto | undefined>;
  setPaymentFailed(externalId: string): Promise<PaymentDto | undefined>;
  setPaymentExpired(externalId: string): Promise<PaymentDto | undefined>;
  getPaymentByExternalId(
    externalId: string,
  ): Promise<PaymentDto | undefined>;
}
