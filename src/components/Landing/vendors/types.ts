// ==========================================
// CENTRALIZED TYPES & DATASETS FOR VENDORS
// ==========================================

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


