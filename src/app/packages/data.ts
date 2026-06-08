export type PackageType = "Silver" | "Gold" | "Diamond";

export interface PackageData {
  id: string;
  name: PackageType;
  price: number;
  description: string;
  features: string[];
  images: string[];
  color: string;
  gradient: string;
}

export const packagesData: PackageData[] = [
  {
    id: "pkg_1",
    name: "Silver",
    price: 5000,
    description: "Perfect for intimate gatherings with essential amenities.",
    features: [
      "Standard Hall Access (6 Hours)",
      "Basic Floral Decoration",
      "Standard Lighting Setup",
      "Seating for up to 100 guests",
      "1 Dressing Room",
    ],
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    ],
    color: "text-slate-500",
    gradient: "from-slate-200 to-slate-100",
  },
  {
    id: "pkg_2",
    name: "Gold",
    price: 8500,
    description: "Our most popular choice, balancing elegance and value.",
    features: [
      "Premium Hall Access (8 Hours)",
      "Premium Theme Decoration",
      "Advanced Lighting & Sound",
      "Seating for up to 250 guests",
      "2 Dressing Rooms",
      "Welcome Drink Station",
    ],
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
    ],
    color: "text-amber-500",
    gradient: "from-amber-200 to-amber-50",
  },
  {
    id: "pkg_3",
    name: "Diamond",
    price: 15000,
    description: "The ultimate luxury experience for your special day.",
    features: [
      "Full Day Hall Access (12 Hours)",
      "Custom Luxury Decoration",
      "Professional Lighting & Concert Sound",
      "Seating for up to 500 guests",
      "4 Dressing Rooms",
      "Valet Parking",
      "Bridal Suite Access",
    ],
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800",
    ],
    color: "text-sky-500",
    gradient: "from-sky-200 to-sky-50",
  },
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
