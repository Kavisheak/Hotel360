// ==========================================
// TYPES & DATASETS FOR THE PACKAGES PAGE
// ==========================================

export interface PackageDetail {
  id: "silver" | "gold" | "diamond";
  name: string;
  price: string;
  priceNum: number;
  guests: string;
  baseGuests: number;
  extraGuestFee: number;
  description: string;
  image: string;
  isMostLoved: boolean;
  features: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface MatrixRow {
  feature: string;
  category: string;
  silver: string;
  gold: string;
  diamond: string;
}

export const SIGNATURE_PACKAGES: PackageDetail[] = [
  {
    id: "silver",
    name: "Silver Package",
    price: "LKR 1.8M",
    priceNum: 1800000,
    guests: "Up to 250 guests",
    baseGuests: 250,
    extraGuestFee: 5000,
    description: "An intimate ceremony of refined essentials, curated for those who appreciate understated elegance.",
    image: "/silver_package.png",
    isMostLoved: false,
    features: [
      "Exclusive 6-hour Ballroom Access",
      "Gourmet Classic Buffet (5 main courses)",
      "Traditional welcome drink presentation",
      "Elegant stage backdrop & high-end bridal settee",
      "Standard House PA & Ambient Wash Lighting",
      "Dedicated On-Day Event Coordinator",
      "Bridal preparation & changing room",
      "Complimentary standard tablescapes"
    ]
  },
  {
    id: "gold",
    name: "Gold Package",
    price: "LKR 3.4M",
    priceNum: 3400000,
    guests: "Up to 380 guests",
    baseGuests: 380,
    extraGuestFee: 6000,
    description: "Our most chosen offering — celebrated for its balance of luxury curation and extensive visual grandeur.",
    image: "/gold_package.png",
    isMostLoved: true,
    features: [
      "Exclusive 6-hour Ballroom & Terrace Access",
      "Signature Premium Buffet (7 main courses)",
      "Crafted premium mocktails on arrival",
      "Suspended visual florals & customized runway design",
      "Synchronized Intelligent LED lighting rigs",
      "Full rehearsal coordination & dedicated concierge",
      "Dedicated Day-Use Luxury Suite for the Couple",
      "Floral table centerpieces & customized linens"
    ]
  },
  {
    id: "diamond",
    name: "Diamond Package",
    price: "LKR 5.9M",
    priceNum: 5900000,
    guests: "Up to 480 guests",
    baseGuests: 480,
    extraGuestFee: 8000,
    description: "A no-restraint affair — the entire venue is yours alone, designed with the highest tier of bespoke details.",
    image: "/diamond_package.png",
    isMostLoved: false,
    features: [
      "Exclusive Full-Day Ballroom, Foyer & Garden Access",
      "Grand Culinary Buffet & Live carving station",
      "Molecular mixology & customizable arrival welcome cocktails",
      "Imported floral architectural installs & custom vinyl dancefloor",
      "Club-spec sound system with dynamic synchronized lasers",
      "Dedicated Personal Liaison & full-scope coordinator support",
      "Overnight stay in Executive Luxury Suite + Couple Breakfast",
      "Opulent floral designs & custom-engraved stationery"
    ]
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: "How far in advance should we reserve our date?",
    answer: "Given that we host only one wedding per day to maintain absolute exclusivity, prime dates (especially weekend nights and auspicious days) are reserved 12 to 18 months in advance. We recommend reaching out as early as possible to secure your desired timing."
  },
  {
    question: "Can we customize or mix elements of different packages?",
    answer: "Absolutely. Our packages serve as aesthetic and service frameworks, but everything from the menu items, lighting patterns, floral species, to timing details can be customized. Use our interactive calculator to explore options, and our concierge team will help you refine the specifics."
  },
  {
    question: "What is your policy regarding outside vendors?",
    answer: "To guarantee that the execution matches the luxury caliber of EASCC, we have a curated list of Approved Luxury Partners (available on our Vendors directory) who are extensively vetted and trained on our venue logistics. Outside vendors are permitted subject to approval by our director and a venue orientation session."
  },
  {
    question: "How do additional guest charges work if we exceed the base capacity?",
    answer: "Each package includes a generous base guest count. If your actual attendance exceeds this count, a per-guest surcharge applies to cover catering, tablescapes, and services. The charges are LKR 5,000 for Silver, LKR 6,000 for Gold, and LKR 8,000 for Diamond. The interactive calculator below will compute this for you."
  },
  {
    question: "What is the payment schedule and reservation deposit?",
    answer: "A non-refundable deposit of 25% of the estimated total is required to hold your date. A second installment of 50% is due 6 months prior to the wedding, and the final remaining balance must be settled 30 days before the celebration date."
  }
];

export const MATRIX_DATA: MatrixRow[] = [
  {
    feature: "Venue Access",
    category: "Space",
    silver: "6 hours (Ballroom)",
    gold: "6 hours (Ballroom + Terrace)",
    diamond: "Full Day (Ballroom, Foyer, Gardens)"
  },
  {
    feature: "Culinary Tier",
    category: "Dining",
    silver: "Classic Buffet (5 mains)",
    gold: "Signature Buffet (7 mains)",
    diamond: "Grand Gourmet & Live Carving Station"
  },
  {
    feature: "Welcome Beverages",
    category: "Dining",
    silver: "Standard welcome drink",
    gold: "Premium mocktails",
    diamond: "Molecular mixology cocktails"
  },
  {
    feature: "Decor & Backdrops",
    category: "Aesthetics",
    silver: "Elegant settee & stage",
    gold: "Suspended ceiling florals & runway",
    diamond: "Bespoke structural builds & custom dancefloor"
  },
  {
    feature: "Sound & Lighting",
    category: "Aesthetics",
    silver: "Standard House PA & Wash",
    gold: "Intelligent LED rigs & wash",
    diamond: "Club-spec sound, lasers, vinyl overlay"
  },
  {
    feature: "Staff & Coordination",
    category: "Service",
    silver: "On-day event coordinator",
    gold: "Concierge & full rehearsal team",
    diamond: "Personal Bridal Liaison & full planning support"
  },
  {
    feature: "Suites & Lodging",
    category: "Service",
    silver: "Bridal changing suite",
    gold: "Bridal Day-Use Suite",
    diamond: "Overnight Executive Suite + Couple Breakfast"
  },
  {
    feature: "Corkage & Alcohol",
    category: "Dining",
    silver: "Standard corkage fee",
    gold: "Complimentary corkage for wine",
    diamond: "Fully complimentary corkage & bartending"
  }
];
