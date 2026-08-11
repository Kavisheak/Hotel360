import React, { useState } from "react";
import { Search, ChevronDown, MapPin, X, Palette, Camera, Music } from "lucide-react";

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
  availabilityFilter: string;
  setAvailabilityFilter: (a: string) => void;
  locationFilter: string;
  setLocationFilter: (l: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  filteredCount: number;
}

export default function VendorsFilters({
  searchQuery,
  setSearchQuery,
  ratingFilter,
  setRatingFilter,
  priceFilter,
  setPriceFilter,
  availabilityFilter,
  setAvailabilityFilter,
  locationFilter,
  setLocationFilter,
  sortBy,
  setSortBy,
  activeTab,
  setActiveTab,
  filteredCount
}: VendorsFiltersProps) {
  
  const handleClearAll = () => {
    setSearchQuery("");
    setRatingFilter(0);
    setPriceFilter("all");
    setAvailabilityFilter("all");
    setLocationFilter("all");
    setSortBy("rating");
    setActiveTab("all");
  };

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="sticky top-[80px] z-40 bg-[#FDFBF7]/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm py-4 md:py-5 pb-3 transition-all w-full">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Mobile Search & Filter Toggle */}
        <div className="flex lg:hidden items-center gap-3 mb-2 md:mb-5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111111] text-sm text-[#2C1E14] dark:text-white border border-gray-200 dark:border-zinc-800 rounded-full outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-sm transition-all placeholder:text-gray-400"
            />
          </div>
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`p-3 bg-white dark:bg-[#111111] border ${isMobileOpen ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300'} rounded-full shadow-sm transition-colors flex-shrink-0`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </button>
        </div>

        {/* Filters Row (Desktop always visible, Mobile conditionally visible) */}
        <div className={`${isMobileOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center gap-4 mb-2 md:mb-5`}>
          
          {/* Desktop Search Input */}
          <div className="relative flex-1 w-full lg:min-w-[300px] hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors, styles, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#111111] text-sm text-[#2C1E14] dark:text-white border border-gray-200 dark:border-zinc-800 rounded-full outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-sm transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Category Tabs (Decorator, Videographer, DJ) */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-zinc-800 rounded-full p-1.5 shadow-sm overflow-x-auto hide-scrollbar w-full lg:w-auto">
             <button 
               onClick={() => setActiveTab("all")} 
               className={`px-5 py-2.5 text-xs font-bold rounded-full flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'all' ? 'bg-amber-50 dark:bg-[#C9A84C]/10 text-[#D4AF37]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
             >
                All Vendors
             </button>
             <button 
               onClick={() => setActiveTab("decorators")} 
               className={`px-5 py-2.5 text-xs font-bold rounded-full flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'decorators' ? 'bg-amber-50 dark:bg-[#C9A84C]/10 text-[#D4AF37]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
             >
                <Palette className="w-3.5 h-3.5" />
                Decorator
             </button>
             <button 
               onClick={() => setActiveTab("videographers")} 
               className={`px-5 py-2.5 text-xs font-bold rounded-full flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'videographers' ? 'bg-amber-50 dark:bg-[#C9A84C]/10 text-[#D4AF37]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
             >
                <Camera className="w-3.5 h-3.5" />
                Videographer
             </button>
             <button 
               onClick={() => setActiveTab("djs")} 
               className={`px-5 py-2.5 text-xs font-bold rounded-full flex items-center gap-2 transition-all flex-shrink-0 ${activeTab === 'djs' ? 'bg-amber-50 dark:bg-[#C9A84C]/10 text-[#D4AF37]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
             >
                <Music className="w-3.5 h-3.5" />
                DJ
             </button>
          </div>

          {/* Location Dropdown */}
          <div className="relative w-full lg:w-auto">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
               <MapPin className="w-4 h-4"/>
             </div>
             <select
               value={locationFilter}
               onChange={(e) => setLocationFilter(e.target.value)}
               className="w-full lg:w-auto appearance-none pl-12 pr-12 py-3.5 bg-white dark:bg-[#111111] text-sm font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 rounded-full outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-sm cursor-pointer"
             >
               <option value="all">All Locations</option>
               <option value="colombo">Colombo</option>
               <option value="kandy">Kandy</option>
               <option value="galle">Galle</option>
             </select>
             <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>



      </div>
    </div>
  );
}
