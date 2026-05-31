import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { MenusDatasource } from "./datasource";
import { MenuCatalogDTO, MenuDetailsDTO, MenuDTO } from "./dto";
import {
  menusTable,
  menusToModifierGroupsTable,
  modifierGroupTable,
  modifierItemTable,
} from "../../platform/drizzle/schema";

export function MenusDatasourceImpl(
  dbClient: NodePgDatabase<typeof import("../../platform/drizzle/schema")>,
): MenusDatasource {
  const getMenus = async (): Promise<MenuDTO[]> => {
    return await dbClient.query.menusTable.findMany();
  };

  const getMenuDetails = async (
    menuId: string,
  ): Promise<MenuDetailsDTO | undefined> => {
    return await dbClient.query.menusTable.findFirst({
      where: (menus, { eq }) => eq(menus.id, Number(menuId)),
      with: {
        modifierGroups: {
          with: {
            modifierGroup: {
              with: {
                items: true,
              },
            },
          },
        },
      },
    });
  };

  const fetchMenuCatalog = async (): Promise<MenuCatalogDTO> => {
    const allMenus = await dbClient.select().from(menusTable);
    const allGroups = await dbClient.select().from(modifierGroupTable);
    const allItems = await dbClient.select().from(modifierItemTable);
    const allBridges = await dbClient.select().from(menusToModifierGroupsTable);
    
    return {
      menus: allMenus,
      modifierGroups: allGroups,
      modifierItems: allItems,
      menuToModifierGroups: allBridges,
    };
  };

  return {
    getMenus,
    getMenuDetails,
    fetchMenuCatalog,
  };
}
