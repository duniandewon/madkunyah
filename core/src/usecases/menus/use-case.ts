import { Menu, MenuDetails } from "../../domain/menus/models";
import { ServiceResponse } from "../../shared/types/responses";

export interface MenusUseCase {
  getAllMenus(): Promise<ServiceResponse<Menu[]>>;
  getMenusDetail(menuId: string): Promise<ServiceResponse<MenuDetails>>;
}
