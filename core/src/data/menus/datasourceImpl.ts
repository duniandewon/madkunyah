import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { MenusDatasource } from "./datasource";
import { MenuDetailsDTO, MenuDTO } from "./dto";

export function MenusDatasourceImpl(
  dbClient: NodePgDatabase<typeof import("../../platform/drizzle/schema")>,
): MenusDatasource {
  const getMenus = async (): Promise<MenuDTO[]> => {
    return await dbClient.query.menusTable.findMany();
  };

  const getMenuDetails = async (menuId: string): Promise<MenuDetailsDTO | undefined> => {
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

  return {
    getMenus,
    getMenuDetails,
  }
}
