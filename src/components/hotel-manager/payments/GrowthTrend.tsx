import React from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const GrowthTrend = () => (
  <div className="space-y-4">
    {/* Growth trend card */}
    <div className="bg-white border border-[#E0D8C3] rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-serif font-semibold text-gray-800 text-sm">Growth Trend</h3>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">Q4 Revenue Projections</p>
      </div>
      {/* Chart image placeholder */}
      <div className="relative h-36 mx-5 mb-5 rounded-lg overflow-hidden bg-[#F2EADA]">
        <Image
          src="/crystal_pavilion_venue.png"
          alt="Revenue trend chart"
          fill
          sizes="320px"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp size={48} className="text-[#B08D2C] opacity-70" />
        </div>
        {/* Trend line overlay */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          <polyline
            points="0,80 40,65 80,55 120,35 160,20 200,10"
            fill="none"
            stroke="#B08D2C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="200" cy="10" r="4" fill="#B08D2C" />
        </svg>
      </div>
    </div>

    {/* Manual Entry card — dark gold */}
    <div className="bg-[#7C6A2E] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Plus size={16} className="text-[#F9DD76]" />
        <h3 className="font-serif font-semibold text-white text-sm">Manual Entry</h3>
      </div>
      <p className="text-xs text-white/70 leading-relaxed mb-4">
        Record a direct cash payment or check that wasn&apos;t initiated via the portal.
      </p>
      <button className="w-full py-2.5 border border-[#F9DD76] text-[#F9DD76] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#F9DD76] hover:text-[#7C6A2E] transition-all">
        Add Transaction
      </button>
    </div>
  </div>
);

export default GrowthTrend;
