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

      if (responseData.success && responseData.data && responseData.data.length > 0) {
        set({ vendors: responseData.data, isLoading: false });
      } else {
        // Fallback mock data if database is empty
        const mockVendors: Vendor[] = [
          {
            id: '6a3a1be4addb5ec71f386a6d', // Matches the DB decorator ID
            name: 'Deco dec (Gilded Floral)',
            category: 'decorators',
            categoryLabel: 'Master Decorator',
            rating: 4.9,
            reviewsCount: 124,
            priceLevel: 'luxury',
            priceLevelLabel: 'Luxury',
            startingPrice: 'LKR 850,000',
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
            specialties: ['Floral Architecture', 'Ambient Lighting', 'Custom Stages'],
            description: 'Renowned for breathtaking floral installations and atmospheric lighting that transforms spaces into magical realms. We focus on bespoke, high-end luxury concepts.',
            portfolio: [
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800',
              'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800'
            ],
            packages: [],
            reviews: []
          },
          {
            id: 'mock-dj-1',
            name: 'DJ Elevate (Nawas)',
            category: 'djs',
            categoryLabel: 'Entertainment',
            rating: 4.8,
            reviewsCount: 89,
            priceLevel: 'premium',
            priceLevelLabel: 'Premium',
            startingPrice: 'LKR 150,000',
            image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
            specialties: ['Premium Sound', 'Live Mixing', 'Dancefloor Lighting'],
            description: 'Bringing the ultimate energy to your event with curated playlists and seamless live mixing. State of the art sound system included.',
            portfolio: [
              'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800'
            ],
            packages: [],
            reviews: []
          },
          {
            id: '6a354e88a4c9cc5cabc399f8', // matches DB videographer ID
            name: 'Luxe Lens Studios',
            category: 'videographers', // 'videographers' to match frontend expected string
            categoryLabel: 'Cinematography',
            rating: 5.0,
            reviewsCount: 210,
            priceLevel: 'elite',
            priceLevelLabel: 'Elite',
            startingPrice: 'LKR 450,000',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
            specialties: ['Drone Footage', '4K Cinematic Edit', 'Same-Day Edit'],
            description: 'Award-winning visual storytelling. We capture the raw emotion and grand scale of your luxury events with cinematic precision.',
            portfolio: [
              'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800',
              'https://images.unsplash.com/photo-1606907568152-7bf5ae65d953?auto=format&fit=crop&w=800'
            ],
            packages: [],
            reviews: []
          }
        ];
        set({ vendors: mockVendors, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || "Network error", isLoading: false });
    }
  },
}));
