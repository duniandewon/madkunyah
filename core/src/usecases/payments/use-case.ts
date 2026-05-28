import { ServiceResponse } from "../../shared/types/responses";
import {
  Payment,
  SetPaymentPaid,
} from "../../domain/payments/models";

export interface PaymentUseCase {
  getPaymentByExternalId(externalId: string): Promise<ServiceResponse<Payment>>;
  paymentSuccess(
    externalId: string,
    data: SetPaymentPaid,
  ): Promise<ServiceResponse<Payment>>;
  paymentFailed(externalId: string): Promise<ServiceResponse<null>>;
  paymentExpired(externalId: string): Promise<ServiceResponse<null>>;
}
