import { create } from "zustand";
import { authAPI } from "@/lib/api";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  shopName?: string;
  ownerNic?: string;
  twoFactorEnabled?: boolean;
  preferences?: any;
  notifications?: any;
  favoriteVendors?: string[];
  savedCards?: any[];
  vendorProfile?: any;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasFetched: boolean;
  isFetching: boolean;
  error: string | null;
  fetchUser: (force?: boolean) => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  hasFetched: false,
  isFetching: false,
  error: null,

  fetchUser: async (force = false) => {
    const state = get();
    if (state.hasFetched && !force) return;
    
    // Prevent duplicate concurrent requests using isFetching
    if (state.isFetching) return;

    set({ isFetching: true });
    if (!state.user) {
      set({ isLoading: true, error: null });
    }

    try {
      const { ok, data } = await authAPI.getMe();
      
      if (ok && data.user) {
        set({ user: data.user, isLoading: false, hasFetched: true, isFetching: false });
        
        // Sync favorites with vendorCartStore
        import("./vendorCartStore").then(({ useVendorCartStore }) => {
          useVendorCartStore.getState().setFavoriteVendors(data.user.favoriteVendors || []);
        });
      } else {
        set({ user: null, isLoading: false, hasFetched: true, isFetching: false, error: data?.message || "Failed to fetch user" });
      }
    } catch (error: any) {
      set({ isLoading: false, hasFetched: true, isFetching: false, error: error.message || "Failed to fetch user" });
    }
  },

  updateUser: (updatedFields) => set((state) => ({
    user: state.user ? { ...state.user, ...updatedFields } : null
  })),

  clearUser: () => {
    set({ user: null, error: null, hasFetched: true, isFetching: false, isLoading: false });
    import("./vendorCartStore").then(({ useVendorCartStore }) => {
      useVendorCartStore.getState().clearCart();
    });
  }
}));
