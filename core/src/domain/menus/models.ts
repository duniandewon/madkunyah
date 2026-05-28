export interface Menu {
  id: number;
  name: string;
  image?: string;
  price: number;
  description?: string;
  isAvailable: boolean;
  category: string;
}

export interface ModifierItem {
  id: number;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: number;
  name: string;
  type: string;
  min_select: number;
  max_select: number;
  items: ModifierItem[];
}

export interface MenuDetails {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  modifier_groups: ModifierGroup[];
}