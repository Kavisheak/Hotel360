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

export const VENDORS_DATA: Vendor[] = [
  {
    id: "gilded-floral",
    name: "Gilded Floral & Co.",
    category: "decorators",
    categoryLabel: "Lead Decorator",
    rating: 4.9,
    reviewsCount: 124,
    priceLevel: "luxury",
    priceLevelLabel: "Luxury Tier",
    startingPrice: "LKR 450,000",
    image: "/gold_package.png",
    specialties: ["Floral Arches", "Suspended Florals", "Luxury Table Styling", "Fairytale Gazebos"],
    description: "Renowned across Colombo for transforming raw spaces into botanical masterpieces. Gilded Floral & Co. specializes in grand architectural florals, suspended overhead gardens, Bohemian crystal chandelier backdrops, and high-fashion tablescapes.",
    portfolio: ["/gold_package.png", "/crystal_chandelier.png", "/luxury_ballroom_bg.png"],
    packages: [
      {
        name: "Standard Ballroom Elegance",
        price: "LKR 450,000",
        features: ["Premium floral arch backdrop", "Elegant bridal settee", "Custom walkway runner", "8 Table centerpiece designs", "Subtle fairy light draping"],
        image: "/gold_package.png"
      },
      {
        name: "Grand Ballroom Signature",
        price: "LKR 850,000",
        features: ["Immersive suspended overhead floral ceiling", "Custom mirrored walkway", "Premium stage backdrop & structure", "Full venue table styling", "12 Premium crystal candelabras", "Warm LED ambient uplighting package"],
        image: "/crystal_chandelier.png"
      },
      {
        name: "Bespoke Royal Grandeur",
        price: "LKR 1,500,000",
        features: ["Unlimited consultation & sketch designs", "Full-scale custom structural build", "Imported white orchid & rose installations", "Curated lounge seating areas", "Custom dancefloor vinyl overlay", "Full stage, table, and foyer coordination"],
        image: "/luxury_ballroom_bg.png"
      }
    ],
    reviews: [
      {
        client: "Amanda & Ryan",
        text: "They turned the EASCC ballroom into a literal enchanted forest! The crystal chandelier installation was breathtaking, and our guests are still talking about the floral arch. Simply flawless execution.",
        rating: 5
      },
      {
        client: "Dilhara P.",
        text: "Immaculate attention to detail. Every tablecloth, candle, and flower felt intentionally placed. Extremely professional team that understands how to work with the high ceilings of EASCC.",
        rating: 5
      }
    ]
  },
  {
    id: "vogue-spaces",
    name: "Vogue Spaces",
    category: "decorators",
    categoryLabel: "Modern Decorator",
    rating: 4.8,
    reviewsCount: 96,
    priceLevel: "premium",
    priceLevelLabel: "Premium Tier",
    startingPrice: "LKR 320,000",
    image: "/crystal_chandelier.png",
    specialties: ["Glasshouse Aesthetics", "Industrial Chic", "Minimalist Modern", "Bespoke Lighting"],
    description: "Specializing in high-concept contemporary styling, Vogue Spaces merges sleek geometric crystal pillars, custom candle corridors, modern amber-wash lighting, and architectural structures to deliver an ultra-sleek layout.",
    portfolio: ["/crystal_chandelier.png", "/virtual_tour_bg.png"],
    packages: [
      {
        name: "Modern Glasshouse Suite",
        price: "LKR 320,000",
        features: ["Geometric metallic arch frames", "Glass pillar centerpieces", "Corridor of 100 glass cylinders with floating candles", "Warm amber ambient wash", "Sleek velvet lounge backdrop"],
        image: "/crystal_chandelier.png"
      },
      {
        name: "Crystal Extravaganza",
        price: "LKR 600,000",
        features: ["Hanging crystal sphere installations", "Mirrored stage layout", "Custom glass block walkway with internal neon bars", "Full floral accentuation on structures", "Intelligent light show integration"],
        image: "/virtual_tour_bg.png"
      }
    ],
    reviews: [
      {
        client: "Kevin & Sanjali",
        text: "Perfect for our modern minimalist vision! The geometric crystal pillars were absolute showstoppers under the ballroom lights. They worked seamlessly with the venue staff.",
        rating: 5
      }
    ]
  },
  {
    id: "royal-heritage",
    name: "Royal Heritage Decor",
    category: "decorators",
    categoryLabel: "Traditional Curator",
    rating: 4.7,
    reviewsCount: 84,
    priceLevel: "elite",
    priceLevelLabel: "Elite Tier",
    startingPrice: "LKR 1,200,000",
    image: "/luxury_ballroom_bg.png",
    specialties: ["Traditional Mandaps", "Royal Poruwads", "Cultural Masterpieces", "Brass Styling"],
    description: "Elite visual curators specialized in recreating ancient heritage palaces and grand royal settings. From intricate gold-gilded poruwads to sprawling luxury carpets, traditional oil lamp designs, and royal velvet drapery.",
    portfolio: ["/luxury_ballroom_bg.png", "/gold_package.png"],
    packages: [
      {
        name: "Imperial Poruwa Signature",
        price: "LKR 1,200,000",
        features: ["Individually carved gold-leaf traditional poruwa", "Ornate brass oil lamps & lotus towers", "Fresh jasmine garlands (500m)", "Sitarist entryway backdrop design", "Royal red/maroon velvet drapery", "Luxury VIP stage carpeting"],
        image: "/luxury_ballroom_bg.png"
      }
    ],
    reviews: [
      {
        client: "Janith & Maleesha",
        text: "It felt like stepping into an ancient palace. The gold leaf detailing on the Poruwa was incredibly detailed. A massive recommendation for anyone wanting a traditional yet luxurious wedding.",
        rating: 5
      }
    ]
  },
  {
    id: "dj-nova",
    name: "DJ Nova",
    category: "djs",
    categoryLabel: "DJ Artist",
    rating: 4.9,
    reviewsCount: 142,
    priceLevel: "premium",
    priceLevelLabel: "Premium Tier",
    startingPrice: "LKR 180,000",
    image: "/images/Frontimg.png",
    specialties: ["Deep House", "Nu-Disco", "Lounge", "Retro & Gold Hits"],
    description: "An international open-format artist known for tailoring soundscapes that transition from refined sunset cocktails to packed, high-energy dancefloors. Vetted extensively for the acoustics of the EASCC high ceilings.",
    portfolio: ["/images/Frontimg.png", "/virtual_tour_bg.png"],
    packages: [
      {
        name: "Sunset Cocktail & Lounge Set",
        price: "LKR 180,000",
        features: ["3-hour performance set", "Sophisticated deep house & lounge curation", "Premium DJ booth setup", "Sound integration with house PA", "Wireless microphone support"]
      },
      {
        name: "The Midnight Gala Show",
        price: "LKR 300,000",
        features: ["5-hour performance set", "Full open-format music program", "Dual high-end club-spec Pioneer CDJ setups", "Synchronized lighting effects & laser rigs", "Custom dancefloor audio subwoofers"]
      }
    ],
    reviews: [
      {
        client: "Ruwan & Sanduni",
        text: "The transition from our sophisticated lounge cocktail hour to the high-energy reception set was absolute genius. He read the room beautifully and kept all generations dancing until midnight!",
        rating: 5
      }
    ]
  },
  {
    id: "dj-silverlight",
    name: "DJ Silverlight",
    category: "djs",
    categoryLabel: "DJ Artist",
    rating: 4.7,
    reviewsCount: 78,
    priceLevel: "luxury",
    priceLevelLabel: "Luxury Tier",
    startingPrice: "LKR 280,000",
    image: "/virtual_tour_bg.png",
    specialties: ["Afrobeats", "Hip Hop", "Sri Lankan Baila", "Top 40 Remixes"],
    description: "A high-energy crowd pleaser who merges timeless classics with fresh modern rhythms, equipped with premium wireless audio feeds, custom light-up DJ booths, and direct mic entertainment capabilities.",
    portfolio: ["/virtual_tour_bg.png"],
    packages: [
      {
        name: "Grand Reception Special",
        price: "LKR 280,000",
        features: ["4-hour performance set", "Dedicated sound engineer", "Custom LED-illuminated DJ booth", "Specialized Baila mega-session", "Wireless mic systems for speeches"]
      }
    ],
    reviews: [
      {
        client: "Michelle & David",
        text: "His Baila medley at the end of the evening was legendary! Absolutely brilliant energy and premium sound clarity. The crowd refused to leave!",
        rating: 4
      }
    ]
  },
  {
    id: "luxe-cinema",
    name: "Luxe Horizon Cinema",
    category: "others",
    categoryLabel: "Cinematic Visuals",
    rating: 4.9,
    reviewsCount: 110,
    priceLevel: "luxury",
    priceLevelLabel: "Luxury Tier",
    startingPrice: "LKR 380,000",
    image: "/diamond_package.png",
    specialties: ["4K Cinematic Video", "Drone Aerials", "Fine Art Albums", "Pre-Shoot Videos"],
    description: "Award-winning visual storytellers specialized in fine art photography and cinematic videography. Luxe Horizon captures raw emotions, fleeting glances, and major celebrations using movie-grade digital rigs and drone views.",
    portfolio: ["/diamond_package.png", "/silver_package.png"],
    packages: [
      {
        name: "Silver Cinematic Package",
        price: "LKR 380,000",
        features: ["1 Lead Fine-Art Photographer", "1 Lead Cinematic Videographer", "8 Hours continuous coverage", "150 edited high-res digital files", "3-5 minute Cinematic Highlight film"]
      },
      {
        name: "Diamond VIP Archive",
        price: "LKR 650,000",
        features: ["2 Senior Photographers & 2 Videographers", "Full 4K Cinematic drone coverage", "Complimentary pre-wedding love story video shoot", "Premium handcrafted leather wedding album", "Full 25-minute documentary event film", "Digital raw file delivery"]
      }
    ],
    reviews: [
      {
        client: "Sarah & Chris",
        text: "Our wedding highlight film looks like a literal Hollywood movie! They captured the grand lighting of EASCC so beautifully. Extremely professional and invisible during the ceremony.",
        rating: 5
      }
    ]
  }
];
