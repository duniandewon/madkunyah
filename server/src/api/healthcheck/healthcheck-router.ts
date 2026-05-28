import { ServiceResponse } from "@madkunyah/core";
import express, { type Request, type Response, type Router } from "express";

export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get("/", (_req: Request, res: Response) => {
  const serviceResponse: ServiceResponse = {
    statusCode: 200,
    message: "OK",
    success: true,
    responseObject: null,
  };
  res.status(serviceResponse.statusCode).send(serviceResponse);
});
