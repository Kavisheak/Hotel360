import React from "react";
import { Search, Award } from "lucide-react";

interface VendorsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  ratingFilter: number;
  setRatingFilter: (r: number) => void;
  priceFilter: string;
  setPriceFilter: (p: string) => void;
  activeTab: "all" | "decorators" | "djs" | "others";
  setActiveTab: (t: "all" | "decorators" | "djs" | "others") => void;
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
          <p>Showing {filteredCount} elite partners matching your filters</p>
          <div className="flex items-center gap-1.5 text-[#C69C6D]">
            <Award className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">100% Quality Vetted</span>
          </div>
        </div>
      </section>
    </>
  );
}
