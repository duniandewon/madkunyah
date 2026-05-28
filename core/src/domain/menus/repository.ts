import { Menu, MenuDetails } from "./models";

export interface MenusRepository {
  getMenus(): Promise<Menu[]>;
  getMenuDetails(menuId: string): Promise<MenuDetails | undefined>;
}
