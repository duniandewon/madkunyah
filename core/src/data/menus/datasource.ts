import { MenuDetailsDTO, MenuDTO } from "./dto";

export interface MenusDatasource {
  getMenus(): Promise<MenuDTO[]>;
  getMenuDetails(menuId: string): Promise<MenuDetailsDTO | undefined>;
}