// ==========================================
// CENTRALIZED TYPES & DATASETS FOR VENDORS
// ==========================================

export interface VendorPackage {
  name: string;
  price: string;
  features: string[];
  image?: string;
}

export interface PortfolioMedia {
  url: string;
  mediaType?: "image" | "video";
  resourceType?: "image" | "video";
}

export interface PortfolioItem {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  price?: number;
  eventType?: string;
  decorationStyle?: string[];
  colorTheme?: string[];
  servicesProvided?: string[];
  media: PortfolioMedia[];
}

export interface VendorReview {
  client: string;
  text: string;
  rating: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: "decorators" | "djs" | "videographers" | "photographers" | "cake" | "florists" | "others";
  categoryLabel: string;
  isVerified?: boolean;
  rating: number;
  reviewsCount: number;
  priceLevel: "premium" | "luxury" | "elite";
  priceLevelLabel: string;
  startingPrice: string;
  image: string;
  avatar?: string;
  specialties: string[];
  description: string;
  portfolio: string[];
  packages: VendorPackage[];
  reviews: VendorReview[];
  location?: string;
  eventsCompleted?: string;
  responseTime?: string;
  depositReq?: string;
  cancellation?: string;
  availableIslandWide?: boolean;
  contactPhone?: string;
  contactEmail?: string;
  portfolioItems?: any[];
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
  createdAt?: string;
  updatedAt?: string;
}


