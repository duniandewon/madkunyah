export interface MenuDTO {
  id: number;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image: string | null;
  isAvailable: boolean;
}

export interface MenuDetailsDTO {
  id: number;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image: string | null;
  isAvailable: boolean;
  modifierGroups: {
    modifierGroupId: number;
    menuId: number;
    modifierGroup: {
      type: string;
      id: number;
      name: string;
      minSelect: number | null;
      maxSelect: number | null;
      items: {
        id: number;
        name: string;
        price: number;
        modifierGroupId: number;
      }[];
    };
  }[];
}

interface ModifierGroupDTO {
  id: number;
  name: string;
  type: string;
  minSelect: number | null;
  maxSelect: number | null;
}

interface ModifierItemDTO {
  id: number;
  name: string;
  price: number;
  modifierGroupId: number;
}

interface MenuToModifierGroupDTO {
  menuId: number;
  modifierGroupId: number;
}

export interface MenuCatalogDTO {
  menus: MenuDTO[];
  modifierGroups: ModifierGroupDTO[];
  modifierItems: ModifierItemDTO[];
  menuToModifierGroups: MenuToModifierGroupDTO[];
}
