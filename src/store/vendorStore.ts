import { create } from "zustand";
import { authAPI, vendorAPI } from "@/lib/api";

export interface VendorPackage {
  name: string;
  description?: string;
  price: string;
  features: string[];
  image?: string;
  eventTypes?: string[];
  duration?: string;
  coverageDuration?: string;
  teamIncluded?: { videographers?: string | number, assistants?: string | number };
  coverage?: string[];
  videoServices?: string[];
  deliverables?: string[];
  videoQuality?: string;
  cameraSetup?: string;
  audio?: string[];
  services?: string[];
  sound?: string[];
  lighting?: string[];
  musicGenres?: string[];
}

export interface VendorReview {
  client: string;
  text: string;
  rating: number;
}

export interface Vendor {
  id: string;
  userId?: string;
  createdAt?: string;
  name: string;
  category: "decorators" | "djs" | "videographers" | "photographers" | "cake" | "florists" | "others";
  categoryLabel: string;
  rating: number;
  reviewsCount: number;
  priceLevel: "premium" | "luxury" | "elite";
  priceLevelLabel: string;
  startingPrice: string;
  defaultPackagePrice?: number; // Fixed price for DJ artists
  image: string;
  avatar?: string;
  specialties: string[];
  description: string;
  portfolio: string[];
  portfolioItems?: {
    id: string;
    title: string;
    description: string;
    price: number;
    media: { url: string; isCover: boolean; designType: string }[];
  }[];
  packages: VendorPackage[];
  reviews: VendorReview[];
  location?: string;
  eventsCompleted?: string;
  responseTime?: string;
  depositReq?: string;
  advancePaymentPercentage?: number;
  cancellation?: string;
  availableIslandWide?: boolean;
  contactPhone?: string;
  contactEmail?: string;
  isVerified?: boolean;
  musicGenres?: string[];
  servicesOffered?: string[];
  eventTypesServed?: string[];
  experience?: string;
  contactPerson?: string;
  serviceAreas?: string[];
  whatsappNumber?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  coverImage?: string;
  culturalExpertise?: string[];
  updatedAt?: string;
}

interface VendorState {
  vendors: Vendor[];
  isLoading: boolean;
  error: string | null;
  fetchVendors: (force?: boolean) => Promise<void>;
}

// Ensure the API url is fetched from environment
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const useVendorStore = create<VendorState>((set, get) => ({
  vendors: [],
  isLoading: false,
  error: null,

  fetchVendors: async (force = true) => {
    // Only fetch if we don't already have vendors, unless forced (which is the default)
    if (get().vendors.length > 0 && !force) return;

    set({ isLoading: true, error: null });
    try {
      const res = await vendorAPI.getAllVendors();
      const responseData = res.data;

      let fetchedData: Vendor[] = [];

      if (responseData.success && responseData.data && responseData.data.length > 0) {
        fetchedData = responseData.data.map((v: any) => ({
          ...v,
          id: v.id || v._id || "",
        }));
      }

      const cleanedData = fetchedData.map(v => ({
        ...v,
        portfolio: v.portfolio || []
      }));

      set({ vendors: cleanedData, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Network error", isLoading: false });
    }
  },
}));


