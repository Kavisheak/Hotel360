import { create } from "zustand";
import { authAPI } from "@/lib/api";

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
      const res = await fetch(`${API_BASE}/api/customer/vendors`);
      const responseData = await res.json();

      let fetchedData: Vendor[] = [];

      if (responseData.success && responseData.data && responseData.data.length > 0) {
        fetchedData = responseData.data.map((v: any) => ({
          ...v,
          id: v.id || v._id || "",
        }));
      } else {
        // Fallback mock data if database is empty
        fetchedData = [
          {
            id: '6a3a1be4addb5ec71f386a6d', // Matches the DB decorator ID
            name: 'Deco dec (Gilded Floral)',
            category: 'decorators',
            categoryLabel: 'Master Decorator',
            rating: 0,
            reviewsCount: 0,
            priceLevel: 'luxury',
            priceLevelLabel: 'Luxury',
            startingPrice: 'LKR 850,000',
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150',
            specialties: ['Floral Architecture', 'Ambient Lighting', 'Custom Stages'],
            description: 'Renowned for breathtaking floral installations and atmospheric lighting that transforms spaces into magical realms. We focus on bespoke, high-end luxury concepts.',
            portfolio: [
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800',
              'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800'
            ],
            packages: [
              {
                name: 'The Golden Canopy',
                price: 'LKR 850,000',
                features: ['Floral backdrop setup', 'Stage carpet & lights', 'Head table floral runner']
              },
              {
                name: 'Royal Champagne Arch',
                price: 'LKR 1,200,000',
                features: ['Imported white roses', 'Custom glass columns', 'Full venue ambient wash lights']
              }
            ],
            reviews: [],
            location: 'Colombo, Sri Lanka',
            eventsCompleted: '340+',
            responseTime: 'within 1 hour',
            advancePaymentPercentage: 30
          },
          {
            id: '6a354e9f123d03e961d01dc2', // Matches the DB DJ ID
            name: 'DJ Elevate (Nawas)',
            category: 'djs',
            categoryLabel: 'Entertainment',
            rating: 0,
            reviewsCount: 0,
            priceLevel: 'premium',
            priceLevelLabel: 'Premium',
            startingPrice: 'LKR 150,000',
            image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150',
            specialties: ['Premium Sound', 'Live Mixing', 'Dancefloor Lighting'],
            description: 'Bringing the ultimate energy to your event with curated playlists and seamless live mixing. State of the art sound system included.',
            portfolio: [
              'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800'
            ],
            packages: [
              {
                name: 'Grand Ballroom Sound Package',
                price: 'LKR 150,000',
                features: ['4 High-fidelity speakers', 'Dual wireless mics', '4-hour live play set']
              }
            ],
            reviews: [],
            location: 'Kandy, Sri Lanka',
            eventsCompleted: '190+',
            responseTime: 'within 2 hours',
            advancePaymentPercentage: 20
          },
          {
            id: '6a354e88a4c9cc5cabc399f8', // matches DB videographer ID
            name: 'Luxe Lens Studios',
            category: 'videographers', // 'videographers' to match frontend expected string
            categoryLabel: 'Cinematography',
            rating: 0,
            reviewsCount: 0,
            priceLevel: 'elite',
            priceLevelLabel: 'Elite',
            startingPrice: 'LKR 450,000',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150',
            specialties: ['Drone Footage', '4K Cinematic Edit', 'Same-Day Edit'],
            description: 'Award-winning visual storytelling. We capture the raw emotion and grand scale of your luxury events with cinematic precision.',
            portfolio: [
              'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800',
              'https://images.unsplash.com/photo-1606907568152-7bf5ae65d953?auto=format&fit=crop&w=800'
            ],
            packages: [
              {
                name: 'The Cinematic Reel',
                price: 'LKR 450,000',
                features: ['2 Cinematographers', 'Full 4K edit', '5-minute highlight trailer', 'Drone coverage']
              }
            ],
            reviews: [],
            location: 'Galle, Sri Lanka',
            eventsCompleted: '290+',
            responseTime: 'within 1 hour',
            advancePaymentPercentage: 40
          }
        ];
      }

      // Guarantee photographer, cake, florist are always available in the store
      const hasPhotographer = fetchedData.some(v => v.category === "photographers");
      if (!hasPhotographer) fetchedData.push(...mockPhotographers);

      const hasCake = fetchedData.some(v => v.category === "cake");
      if (!hasCake) fetchedData.push(...mockCakes);

      const hasFlorist = fetchedData.some(v => v.category === "florists");
      if (!hasFlorist) fetchedData.push(...mockFlorists);

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

// Mock datasets for non-native backend vendor roles
export const mockPhotographers: Vendor[] = [
  {
    id: 'mock_photographer_1',
    name: 'Vogue & Velvet Photography',
    category: 'photographers',
    categoryLabel: 'Fine Art Photography',
    rating: 0,
    reviewsCount: 0,
    priceLevel: 'luxury',
    priceLevelLabel: 'Luxury',
    startingPrice: 'LKR 650,000',
    image: 'https://images.unsplash.com/photo-1537907690979-ee8e01276184?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150',
    specialties: ['Editorial Portraits', 'Film Emulation', 'Same-Day Slide Show'],
    description: 'Specializing in fine art film-style photography. We capture structured poses and candid moments in editorial, magazine-worthy quality.',
    portfolio: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800'
    ],
    packages: [
      {
        name: 'The Editorial Collection',
        price: 'LKR 650,000',
        features: ['Full wedding day coverage', '2 Photographers', 'Film-inspired styling', 'Online gallery + 50 prints'],
      },
      {
        name: 'The Heirloom Package',
        price: 'LKR 950,000',
        features: ['Full wedding day + pre-shoot', '3 Photographers', 'Same-Day Edit Slide Show', 'Custom leather album', 'Raw file delivery'],
      }
    ],
    reviews: [],
    location: 'Colombo, Sri Lanka',
    eventsCompleted: '280+',
    responseTime: 'within 2 hours'
  }
];

export const mockCakes: Vendor[] = [
  {
    id: 'mock_cake_1',
    name: 'The Gold Crust Patisserie',
    category: 'cake',
    categoryLabel: 'Sugar Art & Patisserie',
    rating: 0,
    reviewsCount: 0,
    priceLevel: 'premium',
    priceLevelLabel: 'Premium',
    startingPrice: 'LKR 280,000',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150',
    specialties: ['Custom Sugar Flowers', 'Multi-Tier Sculpting', 'Luxury Flavor Palettes'],
    description: 'We believe your wedding cake should be a stunning centerpiece and a gourmet experience. Every sugar flower is handcrafted.',
    portfolio: [
      'https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1562266649-a573489cf789?auto=format&fit=crop&w=800'
    ],
    packages: [
      {
        name: '3-Tier Sugar Floral Masterpiece',
        price: 'LKR 280,000',
        features: ['3 structural tiers', 'Custom sugar flowers', 'Tasting session', 'Delivery and setup'],
      },
      {
        name: '5-Tier Grand Reception Structure',
        price: 'LKR 450,000',
        features: ['5 grand tiers', 'Gold leaf detailing', 'Bespoke flavor combinations', 'Cake table styling'],
      }
    ],
    reviews: [],
    location: 'Nugegoda, Sri Lanka',
    eventsCompleted: '140+',
    responseTime: 'within 4 hours'
  }
];

export const mockFlorists: Vendor[] = [
  {
    id: 'mock_florist_1',
    name: 'Champagne & Stems Florals',
    category: 'florists',
    categoryLabel: 'Luxury Floral Design',
    rating: 0,
    reviewsCount: 0,
    priceLevel: 'elite',
    priceLevelLabel: 'Elite',
    startingPrice: 'LKR 350,000',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150',
    specialties: ['Premium Imports', 'Monochromatic Concepts', 'Scented Installations'],
    description: 'Providing luxury floral curations for premium tablescapes, arbors, and custom wedding party designs.',
    portfolio: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800'
    ],
    packages: [
      {
        name: 'Champagne Stems Curation',
        price: 'LKR 350,000',
        features: ['Bridal bouquet', '6 bridesmaids bouquets', 'Boutonnieres', 'Head table centerpiece'],
      },
      {
        name: 'Grand Floral Tablescape Package',
        price: 'LKR 680,000',
        features: ['All bridal florals', '20 Guest table arrangements', 'Floral arch design', 'Rose petal pathway design'],
      }
    ],
    reviews: [],
    location: 'Battaramulla, Sri Lanka',
    eventsCompleted: '190+',
    responseTime: 'within 1 hour'
  }
];
