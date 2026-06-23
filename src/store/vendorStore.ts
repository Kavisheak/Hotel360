import { create } from "zustand";
import { authAPI } from "@/lib/api";

export interface VendorPackage {
  name: string;
  price: string;
  features: string[];
  image?: string;
}

export interface VendorReview {
  client: string;
  text: string;
  rating: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: "decorators" | "djs" | "videographers" | "others";
  categoryLabel: string;
  rating: number;
  reviewsCount: number;
  priceLevel: "premium" | "luxury" | "elite";
  priceLevelLabel: string;
  startingPrice: string;
  image: string;
  specialties: string[];
  description: string;
  portfolio: string[];
  packages: VendorPackage[];
  reviews: VendorReview[];
}

interface VendorState {
  vendors: Vendor[];
  isLoading: boolean;
  error: string | null;
  fetchVendors: () => Promise<void>;
}

// Ensure the API url is fetched from environment
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const useVendorStore = create<VendorState>((set, get) => ({
  vendors: [],
  isLoading: false,
  error: null,

  fetchVendors: async () => {
    // Only fetch if we don't already have vendors to avoid redundant calls
    if (get().vendors.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/customer/vendors`);
      const responseData = await res.json();

      if (responseData.success && responseData.data) {
        set({ vendors: responseData.data, isLoading: false });
      } else {
        set({ error: "Failed to fetch vendors", isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || "Network error", isLoading: false });
    }
  },
}));
