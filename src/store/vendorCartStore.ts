import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuItemSelection {
  id: string;
  name: string;
  price: number;
}

interface VendorCartState {
  vendors: Record<"decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist", string | null>;
  requestedDesigns: Record<"decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist", string | null>;
  menuSelection: {
    type: "signature" | "custom" | "none";
    items: MenuItemSelection[]; // legacy
    removedDefaultItems: string[];
    addedOptionalItems: MenuItemSelection[];
  };
  favoriteVendors: string[];
  setFavoriteVendors: (favorites: string[]) => void;
  vendorPackages: Record<"decorator" | "photographer" | "cake" | "florist", string>;
  setVendorPackage: (category: "decorator" | "photographer" | "cake" | "florist", pkgName: string) => void;
  setVendor: (category: keyof VendorCartState["vendors"], id: string | null) => void;
  toggleFavoriteVendor: (id: string) => void;
  setMenuType: (type: "signature" | "custom" | "none") => void;
  addMenuItem: (item: MenuItemSelection) => void;
  removeMenuItem: (itemId: string) => void;
  toggleDefaultItem: (itemId: string) => void;
  toggleOptionalItem: (item: MenuItemSelection) => void;
  clearCart: () => void;
  toggleVendorInEventPlan: (id: string, category: "decorators" | "djs" | "videographers" | "photographers" | "cake" | "florists" | "others", portfolioItemId?: string) => void;
  isVendorInEventPlan: (id: string, category: "decorators" | "djs" | "videographers" | "photographers" | "cake" | "florists" | "others") => boolean;
}

export const useVendorCartStore = create<VendorCartState>()(
  persist(
    (set) => ({
      vendors: {
        decorator: null,
        dj: null,
        videographer: null,
        photographer: null,
        cake: null,
        florist: null
      } as Record<"decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist", string | null>,
      requestedDesigns: {
        decorator: null,
        dj: null,
        videographer: null,
        photographer: null,
        cake: null,
        florist: null
      } as Record<"decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist", string | null>,
      vendorPackages: {
        decorator: "none",
        photographer: "none",
        cake: "none",
        florist: "none"
      } as Record<"decorator" | "photographer" | "cake" | "florist", string>,
      menuSelection: {
        type: "none",
        items: [],
        removedDefaultItems: [],
        addedOptionalItems: [],
      },
      favoriteVendors: [],
      setVendorPackage: (category, pkgName) =>
        set((state) => ({
          vendorPackages: {
            ...state.vendorPackages,
            [category]: pkgName,
          },
        })),
      setVendor: (category, id) =>
        set((state) => ({
          vendors: {
            ...state.vendors,
            [category]: id,
          },
        })),
      setFavoriteVendors: (favorites) => set({ favoriteVendors: favorites }),
      toggleFavoriteVendor: (id) => {
        set((state) => {
          const isSelected = state.favoriteVendors.includes(id);
          return {
            favoriteVendors: isSelected 
              ? state.favoriteVendors.filter(vId => vId !== id)
              : [...state.favoriteVendors, id]
          };
        });

        // Background sync if logged in
        import("./authStore").then(({ useAuthStore }) => {
          const user = useAuthStore.getState().user;
          if (user) {
            import("@/lib/api").then(({ vendorAPI }) => {
              vendorAPI.favoriteVendor(id).catch(console.error);
            });
          }
        });
      },
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
            decorator: null,
            dj: null,
            videographer: null,
            photographer: null,
            cake: null,
            florist: null
          } as Record<"decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist", string | null>,
          requestedDesigns: {
            decorator: null,
            dj: null,
            videographer: null,
            photographer: null,
            cake: null,
            florist: null
          } as Record<"decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist", string | null>,
          vendorPackages: {
            decorator: "none",
            photographer: "none",
            cake: "none",
            florist: "none"
          } as Record<"decorator" | "photographer" | "cake" | "florist", string>,
          menuSelection: {
            type: "none",
            items: [],
            removedDefaultItems: [],
            addedOptionalItems: [],
          },
          favoriteVendors: [],
        }),
      toggleVendorInEventPlan: (id, category, portfolioItemId) => {
        set((state) => {
          let storeCategory: keyof VendorCartState["vendors"];
          if (category === "decorators") storeCategory = "decorator";
          else if (category === "djs") storeCategory = "dj";
          else if (category === "videographers") storeCategory = "videographer";
          else if (category === "photographers") storeCategory = "photographer";
          else if (category === "cake") storeCategory = "cake";
          else if (category === "florists") storeCategory = "florist";
          else storeCategory = "decorator"; // fallback

          const isCurrentlySelected = state.vendors[storeCategory] === id;
          return {
            vendors: {
              ...state.vendors,
              [storeCategory]: isCurrentlySelected ? null : id
            },
            requestedDesigns: {
              ...state.requestedDesigns,
              [storeCategory]: isCurrentlySelected ? null : (portfolioItemId || null)
            }
          };
        });
      },
      isVendorInEventPlan: (id: string, category: "decorators" | "djs" | "videographers" | "photographers" | "cake" | "florists" | "others"): boolean => {
        let storeCategory: keyof VendorCartState["vendors"];
        if (category === "decorators") storeCategory = "decorator";
        else if (category === "djs") storeCategory = "dj";
        else if (category === "videographers") storeCategory = "videographer";
        else if (category === "photographers") storeCategory = "photographer";
        else if (category === "cake") storeCategory = "cake";
        else if (category === "florists") storeCategory = "florist";
        else return false;

        return useVendorCartStore.getState().vendors[storeCategory] === id;
      },
    }),
    {
      name: "vendor-cart",
    }
  )
);
