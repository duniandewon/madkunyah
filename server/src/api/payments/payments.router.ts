import { paymentsController } from "@/common/container";
import express, { Router } from "express";

export const paymentsRouter: Router = express.Router();

paymentsRouter.get("/:externalId", paymentsController.getPaymentByExternalId);