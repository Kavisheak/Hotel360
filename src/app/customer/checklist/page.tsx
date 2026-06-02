"use client";

import React, { useState, useMemo } from 'react';
import { CheckSquare, Check, Sparkles, Filter, RefreshCw } from 'lucide-react';

interface ChecklistItem {
  id: number;
  category: "venue" | "decor" | "vendors" | "guests" | "auspicious";
  title: string;
  desc: string;
  completed: boolean;
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([
    // Venue related
    { id: 1, category: "venue", title: "Lock Grand Ballroom Booking Date", desc: "Pay initial deposit and receive hold conformation letter.", completed: true },
    { id: 2, category: "venue", title: "Submit Auspicious Hours Timeline Details", desc: "Transmit exact scheduled timings to concierge.", completed: true },
    { id: 3, category: "venue", title: "Select Catering Menu Structure", desc: "Choose baseline banquet packages (Menu Gold chosen).", completed: true },
    { id: 4, category: "venue", title: "Submit Final Floor Plan Table Arrangements", desc: "Draw layout placements for stage, poruwa, and table seating.", completed: false },
    // Decor related
    { id: 5, category: "decor", title: "Finalize Decorator Contractor", desc: "Verify floral colors, stage set elements, and entrance panels.", completed: true },
    { id: 6, category: "decor", title: "Confirm Table Centerpieces & Linen Swaps", desc: "Select napkin folding and premium ivory table runners.", completed: true },
    { id: 7, category: "decor", title: "Oil Lamp Placement & Safety Layout Clearances", desc: "Agree on spot positions with estate managers.", completed: false },
    // Vendors related
    { id: 8, category: "vendors", title: "Secure Photographer & Cinematographer", desc: "Arrange timeline arrival schedules with the photography team.", completed: true },
    { id: 9, category: "vendors", title: "Hire DJ or Traditional Orchestra Band", desc: "Confirm sound system rentals and AUS code filings.", completed: true },
    { id: 10, category: "vendors", title: "Arrange Makeup Artist & Dressing Suite Access", desc: "Schedule morning salon arrivals at the bridal chamber.", completed: true },
    { id: 11, category: "vendors", title: "Confirm Master of Ceremonies (MC) Details", desc: "Approve reception speech timeline and event highlights.", completed: false },
    // Guest related
    { id: 12, category: "guests", title: "Send Out Digital Invitations & Save the Dates", desc: "Publish digital invites to friends and family.", completed: true },
    { id: 13, category: "guests", title: "Collect Initial RSVP Attendance Counts", desc: "Log estimated attendees details on the manager sheet.", completed: true },
    { id: 14, category: "guests", title: "Submit Final Guest List Counts & Variance Sheets", desc: "Finalize catering plate numbers (must report by week 2).", completed: false },
    { id: 15, category: "guests", title: "Design Seating Chart & Place Cards Placement", desc: "Map guests to their allocated round-table seats.", completed: false },
    // Auspicious ceremony related
    { id: 16, category: "auspicious", title: "Order Traditional Oil for Auspicious Lamp", desc: "Purchase certified clean organic coconut oil.", completed: true },
    { id: 17, category: "auspicious", title: "Select Astrological Blessing Chorus Singers (Jayamangala Gatha)", desc: "Hire traditional youth chorus for wedding chanting.", completed: true },
    { id: 18, category: "auspicious", title: "Arrange traditional oil lamp brass stands", desc: "Coordinate setup height sizes with the decorator.", completed: false }
  ]);

  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [catFilter, setCatFilter] = useState<"all" | "venue" | "decor" | "vendors" | "guests" | "auspicious">("all");

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const resetAll = () => {
    if (confirm("Are you sure you want to reset all preparation tasks to default?")) {
      setItems(items.map((item, idx) => ({ ...item, completed: idx % 3 !== 0 })));
    }
  };

  const progress = useMemo(() => {
    const total = items.length;
    const completed = items.filter(i => i.completed).length;
    return Math.round((completed / total) * 100);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchStatus = filter === "all" || (filter === "completed" ? item.completed : !item.completed);
      const matchCat = catFilter === "all" || item.category === catFilter;
      return matchStatus && matchCat;
    });
  }, [items, filter, catFilter]);

  return (
    <div className="space-y-8 animate-fadeIn text-[#1A1512]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8DFC9]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C69C6D] block mb-1">
            WEDDING CHECKLIST
          </span>
          <h2 className="text-3xl font-serif text-gray-900 leading-tight">
            Planning & <span className="italic text-[#C69C6D]">Pre-Production</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Toggle preparation items to schedule your setup timelines efficiently with EASCC managers.
          </p>
        </div>

        <button 
          onClick={resetAll}
          className="self-start md:self-center border border-gray-200 text-gray-600 px-3 py-1.5 hover:bg-gray-100 hover:text-black rounded-sm flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Default
        </button>
      </div>

      {/* Progress Widget */}
      <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm space-y-4">
        <div className="flex justify-between items-baseline">
          <h3 className="text-md font-serif text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C69C6D] animate-pulse" /> Checklist Completion Rate
          </h3>
          <span className="text-2xl font-serif font-bold text-[#C69C6D]">{progress}%</span>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full bg-[#FAF6EE] h-2 rounded-full overflow-hidden border border-[#E8DFC9]/40 relative">
          <div 
            className="bg-[#C69C6D] h-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          <span>{items.filter(i => i.completed).length} Tasks Finished</span>
          <span>{items.filter(i => !i.completed).length} Remaining</span>
        </div>
      </div>

      {/* Filters & Actions Grid */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
        {/* Status filters */}
        <div className="flex gap-2">
          {["all", "pending", "completed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st as any)}
              className={`px-4 py-1.5 rounded-sm text-[9px] font-bold tracking-widest uppercase border transition-all duration-200 ${
                filter === st
                  ? "bg-[#1A1512] text-white border-[#1A1512]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select 
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value as any)}
            className="bg-white border border-gray-200 px-3 py-1.5 rounded-sm text-xs font-semibold outline-none focus:border-[#C69C6D]"
          >
            <option value="all">All Categories</option>
            <option value="venue">Venue & Catering</option>
            <option value="decor">Decor & Floral</option>
            <option value="vendors">Creative Team</option>
            <option value="guests">Guest Planning</option>
            <option value="auspicious">Auspicious Ceremony</option>
          </select>
        </div>
      </div>

      {/* Checklist List */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`bg-white border p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 cursor-pointer rounded-sm group ${
                item.completed ? 'border-gray-100 opacity-70' : 'border-[#E8DFC9] hover:border-[#C69C6D]'
              }`}
            >
              {/* Checkbox Icon */}
              <div className="shrink-0 mt-0.5 transition-colors">
                {item.completed ? (
                  <div className="w-5 h-5 bg-[#C69C6D] border border-[#C69C6D] text-black flex items-center justify-center rounded-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 border border-gray-300 hover:border-gray-500 bg-white rounded-sm flex items-center justify-center group-hover:scale-105 transition-transform" />
                )}
              </div>

              {/* Descriptions */}
              <div className="flex-1">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className={`text-sm font-semibold leading-snug transition-colors ${
                    item.completed ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h4>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#C69C6D] shrink-0 bg-[#FAF6EE] px-2 py-0.5 rounded-sm border border-[#E8DFC9]/40">
                    {item.category}
                  </span>
                </div>
                <p className={`text-xs font-light mt-1 transition-colors leading-relaxed ${
                  item.completed ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#E8DFC9] py-16 text-center text-gray-400 rounded-sm">
            <CheckSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-light">No preparation items found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
