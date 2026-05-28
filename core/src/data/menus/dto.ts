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
