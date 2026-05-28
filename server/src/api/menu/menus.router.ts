import { menusController } from '@/common/container';
import express, { Router } from 'express'

export const menusRouter: Router = express.Router();

menusRouter.get("/", menusController.getMenus);
menusRouter.get("/:menuId", menusController.getMenusDetails);