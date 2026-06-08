// ─── Types ────────────────────────────────────────────────────────────────────

export type SpiceLevel = 0 | 1 | 2 | 3 | 4;

export const SPICE_LABELS: Record<SpiceLevel, string> = {
  0: "No Spice",
  1: "Mild",
  2: "Medium",
  3: "Hot",
  4: "Extra Hot",
};

export const SPICE_COLORS: Record<SpiceLevel, string> = {
  0: "#94a3b8",
  1: "#22c55e",
  2: "#eab308",
  3: "#f97316",
  4: "#dc2626",
};

export interface Dish {
  id: string;
  name: string;
  sinhalaName: string;
  description: string;
  pricePerHead: number; // LKR per head if added as an extra
  category: string;
  defaultSpice: SpiceLevel;
  dietaryTags: string[];
  imageGradient: string;
  emoji: string;
  isChefPick?: boolean;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories = [
  "All",
  "Rice & Noodles",
  "Meats & Poultry",
  "Seafood",
  "Vegetables",
  "Sweets & Desserts",
  "Beverages",
] as const;

export type Category = (typeof categories)[number];

// ─── Dietary Tags ─────────────────────────────────────────────────────────────

export const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Gluten-Free",
  "Nut-Free",
] as const;

export type DietaryTag = (typeof dietaryOptions)[number];

// ─── Package Configuration ────────────────────────────────────────────────────

export const BASE_PACKAGE_PRICE = 4500; // Fixed base price per head for the default menu

// The standard default menu items that every user starts with
export const defaultMenuIds = [
  "welcome-drink",
  "yellow-rice",
  "kukul-mas",
  "dhal-curry",
  "brinjal-moju",
  "watalappan"
];

// ─── Dishes ───────────────────────────────────────────────────────────────────

export const dishes: Dish[] = [
  // ── Rice & Noodles ──
  {
    id: "yellow-rice",
    name: "Kaha Bath (Yellow Rice)",
    sinhalaName: "කහ බත්",
    description: "Turmeric-infused basmati rice with pandan leaves, cashews, and raisins.",
    pricePerHead: 350,
    category: "Rice & Noodles",
    defaultSpice: 0,
    dietaryTags: ["Vegetarian", "Vegan", "Halal", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #ffd700 0%, #ffb347 50%, #f4e4c1 100%)",
    emoji: "✨",
  },
  {
    id: "steamed-rice",
    name: "Steamed Samba Rice",
    sinhalaName: "සම්බා බත්",
    description: "Fluffy white samba rice, the perfect canvas for curries.",
    pricePerHead: 200,
    category: "Rice & Noodles",
    defaultSpice: 0,
    dietaryTags: ["Vegetarian", "Vegan", "Halal", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e8dfc9 100%)",
    emoji: "🍚",
  },
  {
    id: "fried-rice",
    name: "Vegetable Fried Rice",
    sinhalaName: "ෆ්‍රයිඩ් රයිස්",
    description: "Wok-tossed rice with finely diced carrots, leeks, and a hint of soy.",
    pricePerHead: 450,
    category: "Rice & Noodles",
    defaultSpice: 1,
    dietaryTags: ["Vegetarian", "Halal"],
    imageGradient: "linear-gradient(135deg, #d4a76a 0%, #cd853f 50%, #8b4513 100%)",
    emoji: "🥘",
  },

  // ── Meats & Poultry ──
  {
    id: "kukul-mas",
    name: "Kukul Mas Curry (Chicken Curry)",
    sinhalaName: "කුකුල් මස් කරිය",
    description: "Slow-simmered chicken in a coconut milk gravy with roasted spices.",
    pricePerHead: 500,
    category: "Meats & Poultry",
    defaultSpice: 3,
    dietaryTags: ["Halal", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #d4763c 0%, #e8a87c 50%, #f9d29d 100%)",
    emoji: "🍗",
    isChefPick: true,
  },
  {
    id: "black-pork",
    name: "Negombo Black Pork Curry",
    sinhalaName: "කළු ඌරු මස් කරිය",
    description: "A dark, peppery, and incredibly aromatic curry made with roasted spices and goraka.",
    pricePerHead: 650,
    category: "Meats & Poultry",
    defaultSpice: 4,
    dietaryTags: ["Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #1a1512 0%, #4a3728 50%, #2c1810 100%)",
    emoji: "🍖",
  },
  {
    id: "beef-smore",
    name: "Ceylon Beef Smore",
    sinhalaName: "බීෆ් ස්මෝර්",
    description: "Tender beef braised with coconut milk, cinnamon, and cloves.",
    pricePerHead: 700,
    category: "Meats & Poultry",
    defaultSpice: 2,
    dietaryTags: ["Halal", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #5c3d2e 0%, #8b4513 50%, #cd853f 100%)",
    emoji: "🥩",
  },

  // ── Seafood ──
  {
    id: "ambul-thiyal",
    name: "Fish Ambul Thiyal (Sour Fish)",
    sinhalaName: "අම්බුල් තියල්",
    description: "Southern coast dry tuna curry, blackened with goraka and pepper.",
    pricePerHead: 600,
    category: "Seafood",
    defaultSpice: 3,
    dietaryTags: ["Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #2c1810 0%, #4a3728 50%, #8b6914 100%)",
    emoji: "🐟",
    isChefPick: true,
  },
  {
    id: "isso-curry",
    name: "Isso Curry (Prawn Curry)",
    sinhalaName: "ඉස්සෝ කරිය",
    description: "Prawns simmered in a spiced coconut cream with tamarind.",
    pricePerHead: 800,
    category: "Seafood",
    defaultSpice: 2,
    dietaryTags: ["Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd700 100%)",
    emoji: "🦐",
  },

  // ── Vegetables ──
  {
    id: "dhal-curry",
    name: "Parippu (Dhal Curry)",
    sinhalaName: "පරිප්පු කරිය",
    description: "Red lentils cooked in rich coconut milk with curry leaves and mustard seeds.",
    pricePerHead: 150,
    category: "Vegetables",
    defaultSpice: 1,
    dietaryTags: ["Vegetarian", "Vegan", "Halal", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #ffb347 0%, #ffcc5c 50%, #f4e4c1 100%)",
    emoji: "🍲",
  },
  {
    id: "brinjal-moju",
    name: "Wambatu Moju (Eggplant Pickle)",
    sinhalaName: "වම්බටු මෝජු",
    description: "Deep-fried eggplant tossed with mustard, vinegar, shallots, and green chilies. Sweet, sour, and spicy.",
    pricePerHead: 250,
    category: "Vegetables",
    defaultSpice: 2,
    dietaryTags: ["Vegetarian", "Vegan", "Halal", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #4b0082 0%, #8a2be2 50%, #da70d6 100%)",
    emoji: "🍆",
    isChefPick: true,
  },
  {
    id: "cashew-curry",
    name: "Kaju Maluwa (Cashew Curry)",
    sinhalaName: "කජු කරිය",
    description: "Raw cashews soaked and cooked in a mild, creamy coconut gravy.",
    pricePerHead: 400,
    category: "Vegetables",
    defaultSpice: 1,
    dietaryTags: ["Vegetarian", "Vegan", "Halal", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #f5deb3 0%, #deb887 50%, #d2b48c 100%)",
    emoji: "🥜",
  },

  // ── Sweets & Desserts ──
  {
    id: "watalappan",
    name: "Watalappan",
    sinhalaName: "වටලප්පන්",
    description: "Rich Malay-influenced coconut custard pudding made with kithul jaggery.",
    pricePerHead: 300,
    category: "Sweets & Desserts",
    defaultSpice: 0,
    dietaryTags: ["Vegetarian", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #8b4513 0%, #d2691e 50%, #ffd700 100%)",
    emoji: "🍮",
    isChefPick: true,
  },
  {
    id: "ice-cream",
    name: "Vanilla Ice Cream & Fruit Salad",
    sinhalaName: "අයිස්ක්‍රීම්",
    description: "Classic vanilla ice cream served with freshly diced tropical fruits.",
    pricePerHead: 250,
    category: "Sweets & Desserts",
    defaultSpice: 0,
    dietaryTags: ["Vegetarian", "Gluten-Free"],
    imageGradient: "linear-gradient(135deg, #fff0f5 0%, #ffe4e1 50%, #ffb6c1 100%)",
    emoji: "🍨",
  },

  // ── Beverages ──
  {
    id: "welcome-drink",
    name: "Mixed Fruit Welcome Drink",
    sinhalaName: "පළතුරු යුෂ",
    description: "A refreshing blend of mango, passionfruit, and pineapple.",
    pricePerHead: 150,
    category: "Beverages",
    defaultSpice: 0,
    dietaryTags: ["Vegetarian", "Vegan", "Halal", "Gluten-Free", "Nut-Free"],
    imageGradient: "linear-gradient(135deg, #ff8c00 0%, #ffd700 50%, #fffacd 100%)",
    emoji: "🍹",
  },
];
