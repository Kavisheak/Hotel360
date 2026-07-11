// Shared types and static data for the Package Settings section

export interface Tier {
  id: string;
  label: string;
  badge?: string;
  price: number;
  guests: number;
  description?: string;
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
    label: 'Silver Package',
    description: 'An intimate ceremony of refined essentials, curated for those who appreciate understated elegance.',
    price: 1800000,
    guests: 250,
    features: [
      { text: 'Exclusive 6-hour Ballroom Access', included: true },
      { text: 'Gourmet Classic Buffet (5 main courses)', included: true },
      { text: 'Traditional welcome drink presentation', included: true },
      { text: 'Elegant stage backdrop & high-end bridal settee', included: true },
      { text: 'Standard House PA & Ambient Wash Lighting', included: true },
      { text: 'Dedicated On-Day Event Coordinator', included: true },
      { text: 'Bridal preparation & changing room', included: true },
      { text: 'Complimentary standard tablescapes', included: true }
    ],
  },
  {
    id: 'gold',
    label: 'Gold Package',
    description: 'Our most chosen offering — celebrated for its balance of luxury curation and extensive visual grandeur.',
    badge: 'MOST POPULAR',
    price: 3400000,
    guests: 380,
    highlighted: true,
    features: [
      { text: 'Exclusive 6-hour Ballroom & Terrace Access', included: true },
      { text: 'Signature Premium Buffet (7 main courses)', included: true },
      { text: 'Crafted premium mocktails on arrival', included: true },
      { text: 'Suspended visual florals & customized runway design', included: true },
      { text: 'Synchronized Intelligent LED lighting rigs', included: true },
      { text: 'Full rehearsal coordination & dedicated concierge', included: true },
      { text: 'Dedicated Day-Use Luxury Suite for the Couple', included: true },
      { text: 'Floral table centerpieces & customized linens', included: true }
    ],
  },
  {
    id: 'diamond',
    label: 'Diamond Package',
    description: 'A no-restraint affair — the entire venue is yours alone, designed with the highest tier of bespoke details.',
    price: 5900000,
    guests: 480,
    features: [
      { text: 'Exclusive Full-Day Ballroom, Foyer & Garden Access', included: true },
      { text: 'Grand Culinary Buffet & Live carving station', included: true },
      { text: 'Molecular mixology & customizable arrival welcome cocktails', included: true },
      { text: 'Imported floral architectural installs & custom vinyl dancefloor', included: true },
      { text: 'Club-spec sound system with dynamic synchronized lasers', included: true },
      { text: 'Dedicated Personal Liaison & full-scope coordinator support', included: true },
      { text: 'Overnight stay in Executive Luxury Suite + Couple Breakfast', included: true },
      { text: 'Opulent floral designs & custom-engraved stationery', included: true }
    ],
  },
];

export const initialFees: SupplementalFee[] = [
  { id: 'f1', category: 'Videography', packageName: 'Cinematic 4K Package',   fee: 1850 },
  { id: 'f2', category: 'DJ Services',  packageName: 'Elite Sound & Lighting', fee: 950  },
  { id: 'f3', category: 'Decoration',   packageName: 'Floral Extravagance',    fee: 3200 },
];
