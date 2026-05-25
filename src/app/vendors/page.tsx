"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Star, 
  DollarSign, 
  Calendar, 
  Users, 
  X, 
  Check, 
  ArrowRight, 
  Award, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Info
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ==========================================
// VENDOR DATABASE (Mock Data)
// ==========================================
interface VendorPackage {
  name: string;
  price: string;
  features: string[];
}

interface VendorReview {
  client: string;
  text: string;
  rating: number;
}

interface Vendor {
  id: string;
  name: string;
  category: "decorators" | "djs" | "others";
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

const VENDORS_DATA: Vendor[] = [
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
        features: ["Premium floral arch backdrop", "Elegant bridal settee", "Custom walkway runner", "8 Table centerpiece designs", "Subtle fairy light draping"]
      },
      {
        name: "Grand Ballroom Signature",
        price: "LKR 850,000",
        features: ["Immersive suspended overhead floral ceiling", "Custom mirrored walkway", "Premium stage backdrop & structure", "Full venue table styling", "12 Premium crystal candelabras", "Warm LED ambient uplighting package"]
      },
      {
        name: "Bespoke Royal Grandeur",
        price: "LKR 1,500,000",
        features: ["Unlimited consultation & sketch designs", "Full-scale custom structural build", "Imported white orchid & rose installations", "Curated lounge seating areas", "Custom dancefloor vinyl overlay", "Full stage, table, and foyer coordination"]
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
        features: ["Geometric metallic arch frames", "Glass pillar centerpieces", "Corridor of 100 glass cylinders with floating candles", "Warm amber ambient wash", "Sleek velvet lounge backdrop"]
      },
      {
        name: "Crystal Extravaganza",
        price: "LKR 600,000",
        features: ["Hanging crystal sphere installations", "Mirrored stage layout", "Custom glass block walkway with internal neon bars", "Full floral accentuation on structures", "Intelligent light show integration"]
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
        features: ["Individually carved gold-leaf traditional poruwa", "Ornate brass oil lamps & lotus towers", "Fresh jasmine garlands (500m)", "Sitarist entryway backdrop design", "Royal red/maroon velvet drapery", "Luxury VIP stage carpeting"]
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
  },
  {
    id: "epicurean-elite",
    name: "Epicurean Elite",
    category: "others",
    categoryLabel: "Fine Dining Caterer",
    rating: 4.8,
    reviewsCount: 150,
    priceLevel: "elite",
    priceLevelLabel: "Elite Tier",
    startingPrice: "LKR 4,500/Pax",
    image: "/silver_package.png",
    specialties: ["Gourmet Buffets", "Live Plated Dinner", "Molecular Mixology", "Artisanal Dessert Bars"],
    description: "Crafting premium culinary journeys, Epicurean Elite curates tailored plated meals, luxurious live oyster and sushi bars, molecular mixology setups, and artistic dessert displays, vetted for high-end EASCC events.",
    portfolio: ["/silver_package.png"],
    packages: [
      {
        name: "Gourmet Grand Banquet",
        price: "LKR 4,500 / Guest",
        features: ["Multi-cuisine premium buffet structure", "4 Luxurious main course selections", "Live carving station (Premium Roast Beef)", "6 Cold appetizers & salads", "Curated dessert bar with 8 varieties"]
      },
      {
        name: "Elite Plated Fine Dining",
        price: "LKR 7,500 / Guest",
        features: ["5-Course plated gourmet dinner", "Custom menu designed by Executive Chef", "Artisanal mocktail pairing session", "Luxury chocolate & pastry display station", "Uniformed silver-service wait staff"]
      }
    ],
    reviews: [
      {
        client: "Nishan & Tanya",
        text: "The molecular mixology bar was an absolute sensation! Every single dish was elegant, hot, and tasted incredible. They raised the bar for wedding dining in Colombo.",
        rating: 5
      }
    ]
  }
];

export default function VendorsDirectory() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState<"all" | "decorators" | "djs" | "others">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number>(0); // 0 means all
  const [priceFilter, setPriceFilter] = useState<string>("all");
  
  // Detail Modal State
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [modalTab, setModalTab] = useState<"about" | "packages" | "reviews">("about");
  
  // Interactive Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    date: "",
    guests: "150",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredVendors = useMemo(() => {
    return VENDORS_DATA.filter((vendor) => {
      // Tab Category Filter
      if (activeTab !== "all" && vendor.category !== activeTab) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = vendor.name.toLowerCase().includes(query);
        const matchesSpecialty = vendor.specialties.some(spec => spec.toLowerCase().includes(query));
        const matchesDesc = vendor.description.toLowerCase().includes(query);
        if (!matchesName && !matchesSpecialty && !matchesDesc) {
          return false;
        }
      }

      // Rating Filter
      if (ratingFilter > 0 && vendor.rating < ratingFilter) {
        return false;
      }

      // Price Level Filter
      if (priceFilter !== "all" && vendor.priceLevel !== priceFilter) {
        return false;
      }

      return true;
    });
  }, [activeTab, searchQuery, ratingFilter, priceFilter]);

  // ==========================================
  // BOOKING SUBMISSION HANDLER
  // ==========================================
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) {
      alert("Please fill in all required fields (Name, Email, Event Date).");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API request and trigger beautiful custom success toast
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setBookingForm({
        name: "",
        email: "",
        date: "",
        guests: "150",
        message: ""
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1512] font-sans selection:bg-[#C69C6D] selection:text-black">
      
      {/* Sticky Premium Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-[#151210]/95 backdrop-blur-md border-b border-[#c69c6d]/20 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-5 h-[1px] bg-[#c69c6d] group-hover:w-8 transition-all duration-300"></div>
            <span className="font-serif text-lg tracking-wider text-[#FAF6EE] normal-case">
              EASCC <span className="font-light italic text-[#c69c6d] text-sm">Conference Center</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-gray-300">
            <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Packages</Link>
            <Link href="/vendors" className="text-[#c69c6d] border-b border-[#c69c6d] pb-0.5 font-bold tracking-widest">Vendors</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Virtual Tour</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Book</Link>
          </nav>

          {/* Call to Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-white transition-colors duration-200">
              Sign In
            </Link>
            <Link 
              href="#" 
              className="border border-[#c69c6d] text-[#c69c6d] px-4 py-1.5 hover:bg-[#c69c6d] hover:text-black transition-all duration-300 text-[10px] uppercase font-bold tracking-widest"
            >
              Reserve
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative w-full py-16 bg-[#1A1512] text-white overflow-hidden border-b border-[#c69c6d]/20">
        {/* Subtle Decorative Background Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white"></div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#c69c6d]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Approved Luxury Partners</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif leading-tight">
            Curate Your <span className="italic text-[#c69c6d]">Unforgettable Union</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-light leading-relaxed">
            We collaborate only with Colombo's elite decorators, musical maestros, and visual storytellers. Vetted for aesthetic excellence and meticulously trained to orchestrate within the grand EASCC Ballroom.
          </p>
        </div>
      </section>

      {/* Search & Filter System Controls Container */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white border border-[#E8DFC9] p-6 shadow-2xl rounded-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Live Search Input */}
            <div className="lg:col-span-5 relative">
              <label className="block text-[9px] uppercase tracking-widest text-[#A6955C] font-bold mb-2">Search Vendor</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialties, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#FAF6EE] text-sm text-[#1A1512] border border-[#E0D8C3] outline-none focus:border-[#C69C6D] transition-all rounded-sm placeholder:text-gray-400 font-sans"
                />
              </div>
            </div>

            {/* Rating Filter Select */}
            <div className="lg:col-span-3">
              <label className="block text-[9px] uppercase tracking-widest text-[#A6955C] font-bold mb-2">Minimum Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="w-full bg-[#FAF6EE] text-sm text-[#1A1512] border border-[#E0D8C3] p-2.5 outline-none focus:border-[#C69C6D] transition-all rounded-sm font-sans"
              >
                <option value="0">All Approved Ratings</option>
                <option value="4.5">⭐⭐⭐⭐★ 4.5+ Stars</option>
                <option value="4.8">⭐⭐⭐⭐⭐ 4.8+ Stars</option>
              </select>
            </div>

            {/* Price Level Tier Selector */}
            <div className="lg:col-span-4">
              <label className="block text-[9px] uppercase tracking-widest text-[#A6955C] font-bold mb-2">Budget Tier</label>
              <div className="grid grid-cols-4 bg-[#FAF6EE] border border-[#E0D8C3] rounded-sm p-1">
                {["all", "premium", "luxury", "elite"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setPriceFilter(tier)}
                    className={`py-1.5 text-[10px] uppercase font-bold tracking-wider transition-all rounded-sm ${
                      priceFilter === tier
                        ? "bg-[#C69C6D] text-black shadow-md"
                        : "text-gray-500 hover:text-[#1A1512]"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Primary Category Selector Tab List */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-wrap gap-4 border-b border-[#E8DFC9] pb-4 justify-center md:justify-start">
          {[
            { id: "all", label: "All Vetted Partners" },
            { id: "decorators", label: "Bespoke Decorators" },
            { id: "djs", label: "DJ Artists & Entertainment" },
            { id: "others", label: "Other Services & Cuisine" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 border-b-2 relative ${
                activeTab === tab.id
                  ? "border-[#C69C6D] text-black bg-[#C69C6D]/5 font-extrabold"
                  : "border-transparent text-gray-500 hover:text-[#1A1512]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C69C6D]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Count Banner */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-light">
          <p>Showing {filteredVendors.length} elite partners matching your filters</p>
          <div className="flex items-center gap-1.5 text-[#C69C6D]">
            <Award className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">100% Quality Vetted</span>
          </div>
        </div>
      </section>

      {/* Grid List of Vetted Vendor Cards */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {filteredVendors.length === 0 ? (
          <div className="bg-white border border-[#E8DFC9] py-16 px-6 text-center space-y-4 rounded-sm shadow-md">
            <Info className="w-12 h-12 mx-auto text-[#A6955C]" />
            <h3 className="text-xl font-serif text-[#1A1512]">No Partners Found</h3>
            <p className="max-w-md mx-auto text-gray-500 text-sm">
              We couldn't find any partners matching your current combination of keywords, filters, or tiers. Try clearing your search query or selecting "All Ratings".
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setRatingFilter(0);
                setPriceFilter("all");
                setActiveTab("all");
              }}
              className="bg-black text-white px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C69C6D] hover:text-black transition-colors rounded-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map((vendor) => (
              <div 
                key={vendor.id} 
                className="bg-white border border-[#E8DFC9] flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 rounded-sm overflow-hidden group"
              >
                {/* Image Wrap & Category Tag Overlay */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                  <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category Label */}
                  <span className="absolute top-4 left-4 bg-black/85 text-[#C69C6D] text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 border border-[#C69C6D]/30 shadow-md">
                    {vendor.categoryLabel}
                  </span>
                  
                  {/* Rating Tag */}
                  <div className="absolute bottom-4 right-4 bg-white/95 text-black px-2.5 py-1 flex items-center gap-1.5 text-xs font-bold shadow-md rounded-sm">
                    <Star className="w-3.5 h-3.5 text-[#C69C6D] fill-[#C69C6D]" />
                    <span>{vendor.rating}</span>
                  </div>
                </div>

                {/* Card Content Description Block */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#A6955C] font-semibold">
                      <span>{vendor.priceLevelLabel}</span>
                      <span className="font-extrabold text-[#7C6A2E]">{vendor.startingPrice} starting</span>
                    </div>

                    <h3 className="text-xl font-serif text-[#1A1512] leading-tight">
                      {vendor.name}
                    </h3>

                    <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed">
                      {vendor.description}
                    </p>
                  </div>

                  {/* Specialty Tags */}
                  <div className="pt-4 flex flex-wrap gap-1.5 border-t border-[#FAF6EE]">
                    {vendor.specialties.slice(0, 3).map((spec, i) => (
                      <span 
                        key={i} 
                        className="bg-[#FAF6EE] text-[#7C6A2E] text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 border border-[#E8DFC9]"
                      >
                        {spec}
                      </span>
                    ))}
                    {vendor.specialties.length > 3 && (
                      <span className="bg-[#FAF6EE] text-gray-400 text-[9px] uppercase tracking-wider px-1.5 py-1">
                        +{vendor.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Trigger Button */}
                <div className="px-6 pb-6 pt-2 bg-white">
                  <button 
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setModalTab("about");
                    }}
                    className="w-full text-center border border-[#1A1512] text-[#1A1512] py-2.5 hover:bg-[#1A1512] hover:text-white transition-all duration-300 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 group-hover:border-[#C69C6D]"
                  >
                    View Details & Packages
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Decorative Brand Trust Divider */}
      <section className="bg-[#1A1512] text-white py-12 px-6 border-t border-[#c69c6d]/20 mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#c69c6d]/20 pb-6 md:pb-0 md:pr-8">
            <div className="flex justify-center md:justify-start text-[#c69c6d]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg">100% Quality Vetted</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Every vendor is legally licensed, background-checked, and highly rated across the Colombo event community.
            </p>
          </div>

          <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#c69c6d]/20 pb-6 md:pb-0 md:pr-8">
            <div className="flex justify-center md:justify-start text-[#c69c6d]">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg">Venue Trained</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Familiar with EASCC rules, safety policies, structural wiring setups, and logistics to ensure seamless execution.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center md:justify-start text-[#c69c6d]">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg">Bespoke Customization</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Collaborate directly with vendor managers and the EASCC concierge to adapt templates specifically to your guest list.
            </p>
          </div>

        </div>
      </section>

      {/* ==========================================
          INTERACTIVE VENDOR DETAIL MODAL OVERLAY
          ========================================== */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-[#FAF6EE] w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden border border-[#E8DFC9] flex flex-col md:flex-row max-h-[90vh]">
            
            {/* LEFT HALF: PORTFOLIO HERO & INQUIRY FORM */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto border-r border-[#E8DFC9] bg-[#FAF6EE]">
              <div className="space-y-5">
                
                {/* Header Back Link */}
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="flex items-center gap-2 text-xs text-[#7C6A2E] hover:text-black font-semibold uppercase tracking-widest"
                >
                  <X className="w-4 h-4" /> Close Details
                </button>

                {/* Vendor Cover Image & Badge */}
                <div className="relative h-48 w-full bg-gray-200 border border-[#E8DFC9] rounded-sm overflow-hidden">
                  <Image
                    src={selectedVendor.image}
                    alt={selectedVendor.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 text-[#C69C6D] text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1">
                    {selectedVendor.categoryLabel}
                  </div>
                </div>

                {/* Name & Title */}
                <div>
                  <h2 className="text-2xl font-serif text-[#1A1512]">{selectedVendor.name}</h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#C69C6D] fill-[#C69C6D]" />
                      <span className="font-bold">{selectedVendor.rating}</span>
                      <span className="text-gray-400">({selectedVendor.reviewsCount} reviews)</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#A6955C] font-semibold uppercase tracking-wider text-[10px]">{selectedVendor.priceLevelLabel}</span>
                  </div>
                </div>

                {/* Interactive Quote Booking Form Container */}
                <div className="border-t border-[#E8DFC9] pt-5">
                  {!isSubmitted ? (
                    <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                      <h4 className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C69C6D]" /> Request Bespoke Consultation
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Your Name"
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                            className="w-full bg-white border border-[#E0D8C3] px-2.5 py-1.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Your Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="client@gmail.com"
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                            className="w-full bg-white border border-[#E0D8C3] px-2.5 py-1.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Event Date *</label>
                          <input
                            type="date"
                            required
                            value={bookingForm.date}
                            onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                            className="w-full bg-white border border-[#E0D8C3] px-2.5 py-1.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Expected Guests</label>
                          <div className="relative">
                            <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="number"
                              value={bookingForm.guests}
                              onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                              className="w-full bg-white border border-[#E0D8C3] pl-8 pr-2.5 py-1.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Custom Requests / Vision</label>
                        <textarea
                          placeholder="Tell us about your visual/musical style requests..."
                          rows={2}
                          value={bookingForm.message}
                          onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                          className="w-full bg-white border border-[#E0D8C3] p-2.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm placeholder:text-gray-400 font-sans resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#1A1512] text-white py-2.5 text-[9px] uppercase tracking-widest font-bold hover:bg-[#C69C6D] hover:text-black transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
                      >
                        {isSubmitting ? (
                          "Submitting to Concierge..."
                        ) : (
                          <>
                            Send Quote Inquiry
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-white border border-[#C69C6D]/35 p-5 text-center space-y-3 shadow-md rounded-sm animate-fadeIn">
                      <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <h4 className="font-serif text-base text-gray-800">Inquiry Received</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                        Thank you, <strong className="text-black">{bookingForm.name || "Valued Client"}</strong>. Your booking inquiry details for <strong className="text-black">{bookingForm.date}</strong> have been logged.
                      </p>
                      <p className="text-[10px] text-[#A6955C] font-semibold uppercase tracking-wider leading-relaxed pt-2 border-t border-dashed border-gray-200">
                        Our Concierge and {selectedVendor.name} will reach out to you within 24 hours to schedule a consultation.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-[9px] uppercase font-bold tracking-widest text-[#7C6A2E] hover:underline"
                      >
                        Submit another request
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* RIGHT HALF: DETAILED PACKAGES, PORTFOLIO & REVIEWS TABS */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-white">
              <div className="space-y-6">
                
                {/* Modal Tab Controls */}
                <div className="flex border-b border-gray-200 pb-2 gap-4">
                  {[
                    { id: "about", label: "About & Portfolio" },
                    { id: "packages", label: `Pricing Packages (${selectedVendor.packages.length})` },
                    { id: "reviews", label: `Guest Reviews (${selectedVendor.reviews.length})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setModalTab(tab.id as any)}
                      className={`pb-1.5 text-xs font-bold tracking-wider uppercase transition-all duration-200 border-b-2 ${
                        modalTab === tab.id
                          ? "border-[#C69C6D] text-black"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content area */}
                <div className="space-y-4">
                  
                  {/* ABOUT TAB */}
                  {modalTab === "about" && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">Signature Narrative</h4>
                        <p className="text-xs text-gray-600 leading-relaxed font-light">
                          {selectedVendor.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">Curated Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedVendor.specialties.map((spec, i) => (
                            <span 
                              key={i} 
                              className="bg-[#FAF6EE] text-[#7C6A2E] text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 border border-[#E8DFC9] rounded-sm"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Mini Image Portfolio */}
                      <div className="space-y-3 pt-3 border-t border-gray-100">
                        <h4 className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">Signature Portfolio Clips</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedVendor.portfolio.map((img, i) => (
                            <div key={i} className="relative h-20 bg-gray-100 rounded-sm overflow-hidden border border-[#E8DFC9]">
                              <Image
                                src={img}
                                alt="Portfolio item"
                                fill
                                className="object-cover hover:scale-110 transition-all duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PACKAGES TAB */}
                  {modalTab === "packages" && (
                    <div className="space-y-4 animate-fadeIn">
                      {selectedVendor.packages.map((pkg, idx) => (
                        <div key={idx} className="border border-[#E8DFC9] bg-[#FAF6EE] p-4 rounded-sm space-y-3">
                          <div className="flex justify-between items-start">
                            <h5 className="font-serif text-sm font-semibold text-[#1A1512]">{pkg.name}</h5>
                            <span className="text-xs font-bold text-[#7C6A2E] bg-white border border-[#E8DFC9] px-2 py-0.5">{pkg.price}</span>
                          </div>
                          
                          <ul className="space-y-1.5">
                            {pkg.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600 leading-relaxed font-light">
                                <ChevronRight className="w-3.5 h-3.5 text-[#C69C6D] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* REVIEWS TAB */}
                  {modalTab === "reviews" && (
                    <div className="space-y-4 animate-fadeIn">
                      {selectedVendor.reviews.map((rev, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-800">{rev.client}</span>
                            
                            {/* Stars */}
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-[#C69C6D] fill-[#C69C6D]" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 italic leading-relaxed font-light">
                            "{rev.text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

              {/* Close Button Footer */}
              <div className="border-t border-gray-100 pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="bg-black text-white text-[9px] uppercase tracking-widest font-bold px-6 py-2.5 hover:bg-[#C69C6D] hover:text-black transition-colors rounded-sm"
                >
                  Back to Directory
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Styled Footer Block Section */}
      <footer className="w-full bg-[#151210] border-t border-[#c69c6d]/20 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-[1px] bg-[#c69c6d]"></div>
            <span className="text-sm font-serif tracking-normal text-[#FAF6EE]">EASCC &copy; 2026</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
            <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Packages</Link>
            <Link href="/vendors" className="text-[#C69C6D] hover:text-white transition-colors duration-200">Vendors</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Virtual Tour</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Book</Link>
          </div>
          
          <p className="text-[9px] text-gray-600 uppercase tracking-widest font-semibold">Crafted with Intention</p>
        </div>
      </footer>

    </div>
  );
}
