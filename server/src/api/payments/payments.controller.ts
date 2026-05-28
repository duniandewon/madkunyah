import { PaymentUseCase } from "@madkunyah/core";
import { Request, RequestHandler, Response } from "express";

export class PaymentsController {
  private paymentUsecase: PaymentUseCase;

  constructor(paymentUsecase: PaymentUseCase) {
    this.paymentUsecase = paymentUsecase;
  }

  getPaymentByExternalId: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const externalId = req.params.externalId as string;
    const response =
      await this.paymentUsecase.getPaymentByExternalId(externalId);

    res.status(response.statusCode).send(response);
  };
}
