import { ordersController } from "@/common/container";
import express, { Router } from "express";

export const ordersRouter: Router = express.Router();

ordersRouter.get("/", ordersController.getOrders);
ordersRouter.post("/", ordersController.createOrder);
