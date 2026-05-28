import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PaymentDto, SetPaymentPaidDto, UpdatePaymentDto } from "./dtos";
import { eq } from "drizzle-orm";
import { PaymentDataSource } from "./datasource";
import { ordersTable, paymentsTable } from "../../platform/drizzle/schema";

export function PaymentDataSourceImpl(
  dbClient: NodePgDatabase<typeof import("../../platform/drizzle/schema")>,
): PaymentDataSource {
  const updatePaymentData = async (
    externalId: string,
    data: UpdatePaymentDto,
  ): Promise<PaymentDto | undefined> => {
    const res = await dbClient
      .update(paymentsTable)
      .set({
        amount: data.amount,
        paymentChannel: data.paymentChannel,
        expiryAt: data.expiryAt,
        paymentLink: data.paymentLink,
      })
      .where(eq(paymentsTable.externalId, externalId))
      .returning();

    return res[0];
  };

  const setPaymentPaid = async (
    externalId: string,
    data: SetPaymentPaidDto,
  ): Promise<PaymentDto | undefined> => {
    return await dbClient.transaction(async (ctx) => {
      const [payment] = await ctx
        .update(paymentsTable)
        .set({
          gatewayTransactionId: data.gatewayTransactionId,
          paidAt: data.paidAt,
          status: "paid",
        })
        .where(eq(paymentsTable.externalId, externalId))
        .returning();

      await ctx
        .update(ordersTable)
        .set({
          paymentStatus: "paid",
          fulfillmentStatus: "preparing",
        })
        .where(eq(ordersTable.id, payment.orderId));

      return payment;
    });
  };

  const setPaymentFailed = async (
    externalId: string,
  ): Promise<PaymentDto | undefined> => {
    const res = await dbClient.transaction(async (ctx) => {
      const [payment] = await ctx
        .update(paymentsTable)
        .set({
          status: "failed",
        })
        .where(eq(paymentsTable.externalId, externalId))
        .returning();

      await ctx
        .update(ordersTable)
        .set({
          paymentStatus: "failed",
          fulfillmentStatus: "canceled",
        })
        .where(eq(ordersTable.id, payment.orderId));

      return payment;
    });

    return res;
  };

  const setPaymentExpired = async (
    externalId: string,
  ): Promise<PaymentDto | undefined> => {
    const res = await dbClient.transaction(async (ctx) => {
      const [payment] = await ctx
        .update(paymentsTable)
        .set({
          status: "expired",
        })
        .where(eq(paymentsTable.externalId, externalId))
        .returning();

      await ctx
        .update(ordersTable)
        .set({
          paymentStatus: "expired",
          fulfillmentStatus: "canceled",
        })
        .where(eq(ordersTable.id, payment.orderId));

      return payment;
    });

    return res;
  };

  const getPaymentByExternalId = async (
    externalId: string,
  ): Promise<PaymentDto | undefined> => {
    const res = await dbClient.query.paymentsTable.findFirst({
      where: (payments, { eq }) => eq(payments.externalId, externalId),
    });

    return res;
  };

  return {
    updatePaymentData,
    setPaymentPaid,
    setPaymentExpired,
    setPaymentFailed,
    getPaymentByExternalId,
  };
}
