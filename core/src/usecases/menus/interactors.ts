import { Menu, MenuDetails } from "../../domain/menus/models";
import { MenusRepository } from "../../domain/menus/repository";
import { ServiceResponse } from "../../shared/types/responses";
import { MenusUseCase } from "./use-case";

export function MenusInteractors(
  menusRepository: MenusRepository,
): MenusUseCase {
  const getAllMenus = async (): Promise<ServiceResponse<Menu[]>> => {
    try {
      const menus = await menusRepository.getMenus();

      return {
        success: true,
        message: "OK",
        responseObject: menus,
        statusCode: 200,
      };
    } catch (err) {
      console.log("error on get menus:", err);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };
  const getMenusDetail = async (
    menuId: string,
  ): Promise<ServiceResponse<MenuDetails>> => {
    try {
      const menu = await menusRepository.getMenuDetails(menuId);
      if (!menu)
        return {
          success: false,
          message: "not found",
          statusCode: 404,
        };

      return {
        success: true,
        message: "OK",
        responseObject: menu,
        statusCode: 200,
      };
    } catch (err) {
      console.log("error on fetch menu detail:", err);
      return {
        success: false,
        message: "something went wrong",
        statusCode: 500,
      };
    }
  };
  return {
    getAllMenus,
    getMenusDetail,
  };
}
