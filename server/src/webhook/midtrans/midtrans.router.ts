import { midtransController } from "@/common/container";
import express, { Router } from "express";

export const midtranseRouter: Router = express.Router();

midtranseRouter.post("/", midtransController.midtransWebHook);
