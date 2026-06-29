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
  error: string | null;
  fetchUser: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    const { ok, data } = await authAPI.getMe();
    
    if (ok && data.user) {
      set({ user: data.user, isLoading: false });
      
      // Sync favorites with vendorCartStore
      import("./vendorCartStore").then(({ useVendorCartStore }) => {
        useVendorCartStore.getState().setFavoriteVendors(data.user.favoriteVendors || []);
      });
    } else {
      set({ user: null, isLoading: false, error: data?.message || "Failed to fetch user" });
    }
  },

  updateUser: (updatedFields) => set((state) => ({
    user: state.user ? { ...state.user, ...updatedFields } : null
  })),

  clearUser: () => {
    set({ user: null, error: null });
    import("./vendorCartStore").then(({ useVendorCartStore }) => {
      useVendorCartStore.getState().clearCart();
    });
  }
}));
