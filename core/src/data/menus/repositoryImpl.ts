import { Menu, MenuCatalog, MenuDetails } from "../../domain/menus/models";
import { MenusRepository } from "../../domain/menus/repository";
import { MenusDatasource } from "./datasource";

export function MenusRepositoryImpl(data: MenusDatasource): MenusRepository {
  const getMenus = async (): Promise<Menu[]> => {
    const menus = await data.getMenus();

    return menus.map((menu) => ({
      description: menu.description || "",
      id: menu.id,
      image: menu.image || "",
      isAvailable: menu.isAvailable,
      name: menu.name,
      price: menu.price,
      category: menu.category,
    }));
  };

  const getMenuDetails = async (
    menuId: string,
  ): Promise<MenuDetails | undefined> => {
    const res = await data.getMenuDetails(menuId);

    if (!res) {
      return;
    }

    const menuDetails: MenuDetails = {
      category: res.category,
      description: res.description || "",
      id: res.id.toString(),
      image: res.image || "",
      name: res.name,
      price: res.price,
      modifier_groups: res.modifierGroups.map((modGroup) => ({
        id: modGroup.modifierGroup.id,
        max_select: modGroup.modifierGroup.maxSelect || 1,
        min_select: modGroup.modifierGroup.minSelect || 0,
        name: modGroup.modifierGroup.name,
        type: modGroup.modifierGroup.type,
        items: modGroup.modifierGroup.items.map((modItem) => ({
          id: modItem.id,
          name: modItem.name,
          price: modItem.price,
        })),
      })),
    };

    return menuDetails;
  };

  const fetchMenuCatalog = async (): Promise<MenuCatalog> => {
    const catalog = await data.fetchMenuCatalog();

    return {
      menuToModifierGroups: catalog.menuToModifierGroups,
      modifierItems: catalog.modifierItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
      menus: catalog.menus.map((menu) => ({
        description: menu.description || "",
        id: menu.id,
        image: menu.image || "",
        isAvailable: menu.isAvailable,
        name: menu.name,
        price: menu.price,
        category: menu.category,
      })),
      modifierGroups: catalog.modifierGroups.map((group) => ({
        items: [],
        id: group.id,
        max_select: group.maxSelect || 1,
        min_select: group.minSelect || 0,
        name: group.name,
        type: group.type,
      })),
    };
  };

  return {
    getMenus,
    getMenuDetails,
    fetchMenuCatalog,
  };
}
