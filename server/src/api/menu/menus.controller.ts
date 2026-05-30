import {
  Menu,
  MenuCatalog,
  MenuDetails,
  MenusUseCase,
  ServiceResponse,
} from "@madkunyah/core";
import { Request, RequestHandler, Response } from "express";

export class MenusController {
  private menusUseCase: MenusUseCase;

  constructor(menusUseCase: MenusUseCase) {
    this.menusUseCase = menusUseCase;
  }

  getMenus: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse: ServiceResponse<Menu[]> =
      await this.menusUseCase.getAllMenus();

    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  getMenusDetails: RequestHandler = async (req: Request, res: Response) => {
    const menuId = req.params.menuId as string;
    const serviceResponse: ServiceResponse<MenuDetails> =
      await this.menusUseCase.getMenusDetail(menuId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  getMenuCatalog: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse: ServiceResponse<MenuCatalog> =
      await this.menusUseCase.getMenuCatalog();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}
