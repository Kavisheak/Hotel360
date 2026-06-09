import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuItemSelection {
  id: string;
  name: string;
  price: number;
}

interface VendorCartState {
  vendors: {
    decorator: string;
    dj: string;
    videographer: string;
    caterer: string;
  };
  menuSelection: {
    type: "signature" | "custom" | "none";
    items: MenuItemSelection[];
  };
  setVendor: (category: keyof VendorCartState["vendors"], id: string) => void;
  setMenuType: (type: "signature" | "custom" | "none") => void;
  addMenuItem: (item: MenuItemSelection) => void;
  removeMenuItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useVendorCartStore = create<VendorCartState>()(
  persist(
    (set) => ({
      vendors: {
        decorator: "none",
        dj: "none",
        videographer: "none",
        caterer: "none",
      },
      menuSelection: {
        type: "none",
        items: [],
      },
      setVendor: (category, id) =>
        set((state) => ({
          vendors: {
            ...state.vendors,
            [category]: id,
          },
        })),
      setMenuType: (type) =>
        set((state) => ({
          menuSelection: {
            ...state.menuSelection,
            type,
          },
        })),
      addMenuItem: (item) =>
        set((state) => ({
          menuSelection: {
            ...state.menuSelection,
            items: [...state.menuSelection.items, item],
          },
        })),
      removeMenuItem: (itemId) =>
        set((state) => ({
          menuSelection: {
            ...state.menuSelection,
            items: state.menuSelection.items.filter((i) => i.id !== itemId),
          },
        })),
      clearCart: () =>
        set({
          vendors: {
            decorator: "none",
            dj: "none",
            videographer: "none",
            caterer: "none",
          },
          menuSelection: {
            type: "none",
            items: [],
          },
        }),
    }),
    {
      name: "vendor-cart-storage",
    }
  )
);
