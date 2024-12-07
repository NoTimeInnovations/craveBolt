import { create } from 'zustand';
import { MenuItem } from './types';

interface MenuStore {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (id: string) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  menuItems: [],
  setMenuItems: (items) => set({ menuItems: items }),
  addMenuItem: (item) => set((state) => ({ 
    menuItems: [...state.menuItems, item] 
  })),
  removeMenuItem: (id) => set((state) => ({ 
    menuItems: state.menuItems.filter((item) => item.id !== id) 
  })),
}));