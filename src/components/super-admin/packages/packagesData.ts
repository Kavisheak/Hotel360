// Shared types and static data for the Package Settings section

export interface Tier {
  id: string;
  label: string;
  badge?: string;
  price: number;
  guests: number;
  baseGuests?: number;
  guestSurcharge?: number;
  icon?: string;
  features: { text: string; included: boolean }[];
  inclusions?: {
    valet: boolean;
    bridal: boolean;
    led: boolean;
    catering: boolean;
  };
  highlighted?: boolean;
}

export interface SupplementalFee {
  id: string;
  category: string;
  packageName: string;
  fee: number;
}

export const initialTiers: Tier[] = [
  {
    id: 'silver',
    label: 'SILVER TIER',
    price: 4500,
    guests: 100,
    features: [
      { text: 'Essential Decor',   included: true  },
      { text: '4-Hour Service',    included: true  },
      { text: 'Valet Parking',     included: false },
    ],
  },
  {
    id: 'gold',
    label: 'GOLD TIER',
    badge: 'MOST POPULAR',
    price: 7200,
    guests: 150,
    highlighted: true,
    features: [
      { text: 'Premium Florals',   included: true },
      { text: '6-Hour Service',    included: true },
      { text: 'Valet Parking',     included: true },
    ],
  },
  {
    id: 'diamond',
    label: 'DIAMOND TIER',
    price: 12000,
    guests: 250,
    features: [
      { text: 'Custom Installations', included: true },
      { text: 'Unlimited Hours',      included: true },
      { text: 'Private Concierge',    included: true },
    ],
  },
];

export const initialFees: SupplementalFee[] = [
  { id: 'f1', category: 'Videography', packageName: 'Cinematic 4K Package',   fee: 1850 },
  { id: 'f2', category: 'DJ Services',  packageName: 'Elite Sound & Lighting', fee: 950  },
  { id: 'f3', category: 'Decoration',   packageName: 'Floral Extravagance',    fee: 3200 },
];
