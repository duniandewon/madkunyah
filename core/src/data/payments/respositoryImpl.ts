import {
  Payment,
  SetPaymentPaid,
  UpdatePayment,
} from "../../domain/payments/models";
import { PaymentRepository } from "../../domain/payments/repository";
import { PaymentDataSource } from "./datasource";

export function PaymentRepositoryImpl(
  ds: PaymentDataSource,
): PaymentRepository {
  const updatePaymentData = async (
    externalId: string,
    data: UpdatePayment,
  ): Promise<Payment | undefined> => {
    const res = await ds.updatePaymentData(externalId, {
      amount: data.amount,
      expiryAt: data.expiryAt,
      paymentChannel: data.paymentChannel,
      paymentLink: data.paymentLink,
    });

    if (!res) return;

    return {
      amount: res.amount,
      expiryAt: res.expiryAt,
      externalId: res.externalId,
      id: res.id,
      orderId: res.orderId,
      paymentLink: res.paymentLink,
      status: res.status,
    };
  };
  const setPaymentPaid = async (
    externalId: string,
    data: SetPaymentPaid,
  ): Promise<Payment | undefined> => {
    const res = await ds.setPaymentPaid(externalId, {
      gatewayTransactionId: data.gatewayTransactionId,
      paidAt: data.paidAt,
    });

    if (!res) return;

    return {
      amount: res.amount,
      expiryAt: res.expiryAt || new Date(),
      paymentLink: res.paymentLink || "",
      status: res.status,
      externalId: res.externalId,
      id: res.id,
      orderId: res.orderId,
    };
  };

  const setPaymentFailed = async (
    externalId: string,
  ): Promise<Payment | undefined> => {
    const res = await ds.setPaymentFailed(externalId);

    if (!res) return;

    return {
      amount: res.amount,
      expiryAt: res.expiryAt || new Date(),
      paymentLink: res.paymentLink || "",
      status: res.status,
      externalId: res.externalId,
      id: res.id,
      orderId: res.orderId,
    };
  };

  const setPaymentExpired = async (
    externalId: string,
  ): Promise<Payment | undefined> => {
    const res = await ds.setPaymentFailed(externalId);
    if (!res) return;

    return {
      amount: res.amount,
      expiryAt: res.expiryAt || new Date(),
      paymentLink: res.paymentLink || "",
      status: res.status,
      externalId: res.externalId,
      id: res.id,
      orderId: res.orderId,
    };
  };

  const getPaymentsByExternalId = async (
    extternalId: string,
  ): Promise<Payment | undefined> => {
    const res = await ds.getPaymentByExternalId(extternalId);

    if (!res) return;

    return {
      amount: res.amount,
      expiryAt: res.expiryAt,
      externalId: res.externalId,
      id: res.id,
      orderId: res.orderId,
      paymentLink: res.paymentLink,
      status: res.status,
    };
  };

  return {
    updatePaymentData,
    setPaymentPaid,
    setPaymentExpired,
    setPaymentFailed,
    getPaymentsByExternalId,
  };
}
