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
  };
  menuSelection: {
    type: "signature" | "custom" | "none";
    items: MenuItemSelection[]; // legacy
    removedDefaultItems: string[];
    addedOptionalItems: MenuItemSelection[];
  };
  favoriteVendors: string[];
  setVendor: (category: keyof VendorCartState["vendors"], id: string) => void;
  toggleFavoriteVendor: (id: string) => void;
  setMenuType: (type: "signature" | "custom" | "none") => void;
  addMenuItem: (item: MenuItemSelection) => void;
  removeMenuItem: (itemId: string) => void;
  toggleDefaultItem: (itemId: string) => void;
  toggleOptionalItem: (item: MenuItemSelection) => void;
  clearCart: () => void;
}

export const useVendorCartStore = create<VendorCartState>()(
  persist(
    (set) => ({
      vendors: {
        decorator: "none",
        dj: "none",
        videographer: "none"
      },
      menuSelection: {
        type: "none",
        items: [],
        removedDefaultItems: [],
        addedOptionalItems: [],
      },
      favoriteVendors: [],
      setVendor: (category, id) =>
        set((state) => ({
          vendors: {
            ...state.vendors,
            [category]: id,
          },
        })),
      toggleFavoriteVendor: (id) =>
        set((state) => {
          const isSelected = state.favoriteVendors.includes(id);
          return {
            favoriteVendors: isSelected 
              ? state.favoriteVendors.filter(vId => vId !== id)
              : [...state.favoriteVendors, id]
          };
        }),
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
      toggleDefaultItem: (itemId) =>
        set((state) => {
          const removed = state.menuSelection.removedDefaultItems;
          return {
            menuSelection: {
              ...state.menuSelection,
              removedDefaultItems: removed.includes(itemId)
                ? removed.filter(id => id !== itemId)
                : [...removed, itemId],
            }
          };
        }),
      toggleOptionalItem: (item) =>
        set((state) => {
          const added = state.menuSelection.addedOptionalItems;
          const isAdded = added.some(i => i.id === item.id);
          return {
            menuSelection: {
              ...state.menuSelection,
              addedOptionalItems: isAdded
                ? added.filter(i => i.id !== item.id)
                : [...added, item],
            }
          };
        }),
      clearCart: () =>
        set({
          vendors: {
            decorator: "none",
            dj: "none",
            videographer: "none"
          },
          menuSelection: {
            type: "none",
            items: [],
            removedDefaultItems: [],
            addedOptionalItems: [],
          },
        }),
    }),
    {
      name: "vendor-cart-storage-v2",
    }
  )
);
