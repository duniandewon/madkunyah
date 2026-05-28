import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import errorHandler from "./common/errorHandler";
import requestLogger from "./common/requestLogger";
import { healthCheckRouter } from "./api/healthcheck/healthcheck-router";
import rateLimiter from "./common/rateLimiter";
import { menusRouter } from "./api/menu/menus.router";
import { ordersRouter } from "./api/orders/orders.router";
import { paymentsRouter } from "./api/payments/payments.router";
import { midtranseRouter } from "./webhook/midtrans/midtrans.router";
import { env } from "@madkunyah/core";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/api/menus", menusRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);

app.use("/webhooks/midtrans", midtranseRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
