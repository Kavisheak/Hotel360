"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, ShieldCheck } from 'lucide-react';

export default function CeremonyDetails() {
  return (
    <div className="bg-white border border-[#D4C9A8] p-6 shadow-sm rounded-sm hover-glow transition-all duration-300">
      <h3 className="text-lg font-serif text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#C9A84C]" /> Ceremony Details
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs font-light">
          <div className="bg-[#F0E6D0] p-3 rounded-sm hover:bg-[#E4D8BD] transition-colors">
            <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Venue Reserved</span>
            <p className="font-semibold text-gray-900 mt-1">EASCC Grand Ballroom</p>
          </div>
          <div className="bg-[#F0E6D0] p-3 rounded-sm hover:bg-[#E4D8BD] transition-colors">
            <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Wedding Date</span>
            <p className="font-semibold text-gray-900 mt-1">June 4, 2026</p>
          </div>
          <div className="bg-[#F0E6D0] p-3 rounded-sm hover:bg-[#E4D8BD] transition-colors">
            <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Timeslot Schedule</span>
            <p className="font-semibold text-gray-900 mt-1">Evening Soiree (4pm - 10pm)</p>
          </div>
          <div className="bg-[#F0E6D0] p-3 rounded-sm hover:bg-[#E4D8BD] transition-colors">
            <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Celebration Package</span>
            <p className="font-semibold text-gray-900 mt-1">Gold Package (380 Pax)</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-4 flex gap-3 rounded-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-gray-900">Date Hold Vetted</h4>
            <p className="text-[11px] text-gray-600 font-light mt-0.5 leading-relaxed">
              EASCC Estate holds a 100% reservation guarantee for June 4, 2026. No other events are scheduled on this date.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <Link 
          href="/customer/book"
          className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] hover:text-[#2C1E14] transition-colors"
        >
          View Detailed Booking Statement &rarr;
        </Link>
      </div>
    </div>
  );
}
