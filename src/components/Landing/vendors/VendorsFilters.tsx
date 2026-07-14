import React from "react";
import { Search, Award } from "lucide-react";

interface VendorsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  ratingFilter: number;
  setRatingFilter: (r: number) => void;
  priceFilter: string;
  setPriceFilter: (p: string) => void;
  styleFilter: string;
  setStyleFilter: (s: string) => void;
  settingFilter: string;
  setSettingFilter: (s: string) => void;
  activeTab: "all" | "decorators" | "videographers" | "djs" | "photographers" | "cake" | "florists";
  setActiveTab: (t: "all" | "decorators" | "videographers" | "djs" | "photographers" | "cake" | "florists") => void;
  filteredCount: number;
}

export default function VendorsFilters({
  searchQuery,
  setSearchQuery,
  ratingFilter,
  setRatingFilter,
  priceFilter,
  setPriceFilter,
  styleFilter,
  setStyleFilter,
  settingFilter,
  setSettingFilter,
  activeTab,
  setActiveTab,
  filteredCount
}: VendorsFiltersProps) {
  return (
    <>
      {/* Search & Filter System Controls Container */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white dark:bg-[#111111] border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 p-6 shadow-2xl rounded-sm section-reveal hover-glow transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Live Search Input */}
            <div className="lg:col-span-3 relative">
              <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Search Portfolio</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Keyword search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#1A1A1A] text-sm text-[#2C1E14] dark:text-white border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 outline-none focus:border-[#D4AF37] dark:focus:border-[#C9A84C] transition-all rounded-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 font-sans input-glow"
                />
              </div>
            </div>

            {/* Rating Filter Select */}
            <div className="lg:col-span-2">
              <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Min Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#1A1A1A] text-sm text-[#2C1E14] dark:text-white border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 p-2.5 outline-none focus:border-[#D4AF37] dark:focus:border-[#C9A84C] transition-all rounded-sm font-sans input-glow"
              >
                <option value="0">All Ratings</option>
                <option value="4.5">⭐ 4.5+ Stars</option>
                <option value="4.8">⭐ 4.8+ Stars</option>
              </select>
            </div>

            {/* Price Level Tier Selector */}
            <div className="lg:col-span-3">
              <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Budget Tier</label>
              <div className="grid grid-cols-4 bg-white dark:bg-[#1A1A1A] border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 rounded-sm p-1">
                {["all", "premium", "luxury", "elite"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setPriceFilter(tier)}
                    className={`py-1.5 text-[9px] uppercase font-bold tracking-wider transition-all rounded-sm btn-interactive ${
                      priceFilter === tier
                        ? "bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#1A1A1A] shadow-md"
                        : "bg-transparent text-gray-600 dark:text-gray-500 hover:text-[#2C1E14] dark:hover:text-white"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="lg:col-span-2">
              <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Artistic Style</label>
              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                className="w-full bg-white dark:bg-[#1A1A1A] text-sm text-[#2C1E14] dark:text-white border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 p-2.5 outline-none focus:border-[#D4AF37] dark:focus:border-[#C9A84C] transition-all rounded-sm font-sans input-glow"
              >
                <option value="all">All Styles</option>
                <option value="luxury">Luxury / Fine Art</option>
                <option value="modern">Modern / Editorial</option>
                <option value="traditional">Traditional / Classic</option>
              </select>
            </div>

            {/* Setting Selector */}
            <div className="lg:col-span-2">
              <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Venue Setting</label>
              <select
                value={settingFilter}
                onChange={(e) => setSettingFilter(e.target.value)}
                className="w-full bg-white dark:bg-[#1A1A1A] text-sm text-[#2C1E14] dark:text-white border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 p-2.5 outline-none focus:border-[#D4AF37] dark:focus:border-[#C9A84C] transition-all rounded-sm font-sans input-glow"
              >
                <option value="all">Any Setting</option>
                <option value="indoor">Indoor Spaces</option>
                <option value="outdoor">Outdoor Gardens</option>
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* Primary Category Selector Tab List */}
      <section className="max-w-7xl mx-auto px-6 pt-10 section-reveal stagger-1">
        <div className="flex flex-wrap gap-4 border-b border-[#D4C9A8] dark:border-[#C9A84C]/30 pb-4 justify-center md:justify-start">
          {[
            { id: "all", label: "All Portfolio Works" },
            { id: "decorators", label: "Floral & Stages" },
            { id: "videographers", label: "Cinematography" },
            { id: "djs", label: "DJs & Entertainment" },
            { id: "photographers", label: "Photographers" },
            { id: "cake", label: "Cake Artisans" },
            { id: "florists", label: "Florists" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 border-b-2 relative ${
                activeTab === tab.id
                  ? "border-[#D4AF37] dark:border-[#C9A84C] text-[#2C1E14] dark:text-white bg-transparent font-extrabold"
                  : "border-transparent text-gray-500 hover:text-[#2C1E14] dark:hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] dark:bg-[#C9A84C]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Count Banner */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-500 font-light">
          <p>Showing {filteredCount} elite partners matching your filters</p>
          <div className="flex items-center gap-1.5 text-[#C9A84C]">
            <Award className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">100% Quality Vetted</span>
          </div>
        </div>
      </section>
    </>
  );
}
