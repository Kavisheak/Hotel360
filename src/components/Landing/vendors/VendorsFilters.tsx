import React from "react";
import { Search, Award } from "lucide-react";

interface VendorsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  ratingFilter: number;
  setRatingFilter: (r: number) => void;
  priceFilter: string;
  setPriceFilter: (p: string) => void;
  activeTab: "all" | "decorators" | "djs" | "caterers" | "others";
  setActiveTab: (t: "all" | "decorators" | "djs" | "caterers" | "others") => void;
  filteredCount: number;
}

export default function VendorsFilters({
  searchQuery,
  setSearchQuery,
  ratingFilter,
  setRatingFilter,
  priceFilter,
  setPriceFilter,
  activeTab,
  setActiveTab,
  filteredCount
}: VendorsFiltersProps) {
  return (
    <>
      {/* Search & Filter System Controls Container */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white border border-[#D4C9A8] p-6 shadow-2xl rounded-sm section-reveal hover-glow transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Live Search Input */}
            <div className="lg:col-span-5 relative">
              <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Search Vendor</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialties, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F0E6D0]/30 text-sm text-[#2C1E14] border border-[#D4C9A8] outline-none focus:border-[#C9A84C] transition-all rounded-sm placeholder:text-gray-400 font-sans input-glow"
                />
              </div>
            </div>

            {/* Rating Filter Select */}
            <div className="lg:col-span-3">
              <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Minimum Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="w-full bg-[#F0E6D0]/30 text-sm text-[#2C1E14] border border-[#D4C9A8] p-2.5 outline-none focus:border-[#C9A84C] transition-all rounded-sm font-sans input-glow"
              >
                <option value="0">All Approved Ratings</option>
                <option value="4.5">⭐⭐⭐⭐★ 4.5+ Stars</option>
                <option value="4.8">⭐⭐⭐⭐⭐ 4.8+ Stars</option>
              </select>
            </div>

            {/* Price Level Tier Selector */}
            <div className="lg:col-span-4">
              <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Budget Tier</label>
              <div className="grid grid-cols-4 bg-[#F0E6D0]/30 border border-[#D4C9A8] rounded-sm p-1">
                {["all", "premium", "luxury", "elite"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setPriceFilter(tier)}
                    className={`py-1.5 text-[10px] uppercase font-bold tracking-wider transition-all rounded-sm btn-interactive ${
                      priceFilter === tier
                        ? "bg-[#C9A84C] text-[#2C1E14] shadow-md"
                        : "text-gray-500 hover:text-[#2C1E14]"
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
      <section className="max-w-7xl mx-auto px-6 pt-10 section-reveal stagger-1">
        <div className="flex flex-wrap gap-4 border-b border-[#D4C9A8] pb-4 justify-center md:justify-start">
          {[
            { id: "all", label: "All Vetted Partners" },
            { id: "decorators", label: "Bespoke Decorators" },
            { id: "djs", label: "DJ Artists & Entertainment" },
            { id: "caterers", label: "Gourmet Caterers" },
            { id: "others", label: "Other Services & Visuals" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 border-b-2 relative ${
                activeTab === tab.id
                  ? "border-[#C9A84C] text-[#2C1E14] bg-[#C9A84C]/5 font-extrabold"
                  : "border-transparent text-gray-500 hover:text-[#2C1E14]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C9A84C]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Count Banner */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-light">
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
