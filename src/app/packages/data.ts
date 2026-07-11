export type PackageType = "Silver" | "Gold" | "Diamond";

export interface PackageData {
  id: string;
  name: PackageType;
  priceLabel: string;
  priceValue: number; // base value for calculations
  guestsLabel: string;
  description: string;
  features: string[];
  image: string;
}

export const packagesData: PackageData[] = [
  {
    id: "pkg_silver",
    name: "Silver",
    priceLabel: "LKR 1.8M",
    priceValue: 1800000,
    guestsLabel: "Up to 250 guests",
    description: "An intimate ceremony of refined essentials, curated for those who appreciate understated elegance.",
    features: [
      "Exclusive 6-hour Ballroom Access",
      "Gourmet Classic Buffet (5 main courses)",
      "Traditional welcome drink presentation",
      "Elegant stage backdrop & high-end bridal settee",
      "Standard House PA & Ambient Wash Lighting",
      "Dedicated On-Day Event Coordinator",
      "Bridal preparation & changing room",
      "Complimentary standard tablescapes"
    ],
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "pkg_gold",
    name: "Gold",
    priceLabel: "LKR 3.4M",
    priceValue: 3400000,
    guestsLabel: "Up to 380 guests",
    description: "Our most chosen offering — celebrated for its balance of luxury curation and extensive visual grandeur.",
    features: [
      "Exclusive 6-hour Ballroom & Terrace Access",
      "Signature Premium Buffet (7 main courses)",
      "Crafted premium mocktails on arrival",
      "Suspended visual florals & customized runway design",
      "Synchronized Intelligent LED lighting rigs",
      "Full rehearsal coordination & dedicated concierge",
      "Dedicated Day-Use Luxury Suite for the Couple",
      "Floral table centerpieces & customized linens"
    ],
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "pkg_diamond",
    name: "Diamond",
    priceLabel: "LKR 5.9M",
    priceValue: 5900000,
    guestsLabel: "Up to 480 guests",
    description: "A no-restraint affair — the entire venue is yours alone, designed with the highest tier of bespoke details.",
    features: [
      "Exclusive Full-Day Ballroom, Foyer & Garden Access",
      "Grand Culinary Buffet & Live carving station",
      "Molecular mixology & customizable arrival welcome cocktails",
      "Imported floral architectural installs & custom vinyl dancefloor",
      "Club-spec sound system with dynamic synchronized lasers",
      "Dedicated Personal Liaison & full-scope coordinator support",
      "Overnight stay in Executive Luxury Suite + Couple Breakfast",
      "Opulent floral designs & custom-engraved stationery"
    ],
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
  }
];

export const vendorsData = {
  decorators: [
    { id: "dec_1", name: "Elegant Events", phone: "+94 77 123 4567", price: 150000, rating: 4.8 },
    { id: "dec_2", name: "Royal Themes", phone: "+94 71 234 5678", price: 250000, rating: 4.9 },
    { id: "dec_3", name: "Budget Blooms", phone: "+94 76 345 6789", price: 80000, rating: 4.5 },
  ],
  videographers: [
    { id: "vid_1", name: "Cinematic Memories", phone: "+94 70 456 7890", price: 120000, rating: 4.7 },
    { id: "vid_2", name: "ProLens Studio", phone: "+94 77 567 8901", price: 200000, rating: 4.9 },
    { id: "vid_3", name: "Classic Clicks", phone: "+94 75 678 9012", price: 90000, rating: 4.6 },
  ],
  djs: [
    { id: "dj_1", name: "DJ Spark", phone: "+94 72 789 0123", price: 50000, rating: 4.7 },
    { id: "dj_2", name: "SoundWave", phone: "+94 71 890 1234", price: 80000, rating: 4.9 },
    { id: "dj_3", name: "Night Beats", phone: "+94 77 901 2345", price: 40000, rating: 4.5 },
  ],
};

export const foodMenus = [
  { id: "food_1", name: "Sri Lankan Classic Buffet", pricePerPlate: 2500, type: "Mix", description: "Rice & Curry (3 Meats), Watalappam" },
  { id: "food_2", name: "Royal Banquet Feast", pricePerPlate: 4500, type: "Mix", description: "Fried Rice, Devilled Chicken, Kottu Station" },
  { id: "food_3", name: "Pure Veg Delight", pricePerPlate: 3000, type: "Veg", description: "Vegetable Fried Rice, Cashew Curry, String Hoppers" },
];
