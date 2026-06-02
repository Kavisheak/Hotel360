"use client";

import React from 'react';
import { 
  Calendar, Clock, Users, ShieldCheck, 
  MapPin, Award, BookOpen, FileText 
} from 'lucide-react';

export default function BookingsPage() {
  const auspiciousTimeline = [
    { time: "4:00 PM", title: "Arrival of Guests & Welcoming", desc: "Arrival of guests, high-tea served at the arrival foyer garden." },
    { time: "4:30 PM", title: "Auspicious Poruwa Ceremony & Oil Lamp Lighting", desc: "Traditional wedding ceremony with beating of Magul Bera and lighting the oil lamp." },
    { time: "5:15 PM", title: "Ring Exchange & Vows Exchange", desc: "Formal exchange of vows and signing of the marriage register." },
    { time: "6:00 PM", title: "Cake Cutting & Champagne Toast", desc: "Official toast by the best man and cake cutting under Bohemian crystal chandeliers." },
    { time: "7:00 PM", title: "Premium Banquet Dinner Opens", desc: "Opening of the luxury buffet/table service dining with background instrumental music." },
    { time: "9:30 PM", title: "Grand Farewell Send-off", desc: "Departure of the couple amidst the sparklers and departure of guests." }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[#1A1512]">
      {/* Header */}
      <div className="pb-6 border-b border-[#E8DFC9]">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#C69C6D] block mb-1">
          RESERVATION STATEMENT
        </span>
        <h2 className="text-3xl font-serif text-gray-900 leading-tight">
          Your Wedding <span className="italic text-[#C69C6D]">Specifications</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Detailed overview of your reserved estate schedule, auspicious timeline and packages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: General Specs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Reservation Card */}
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm space-y-6">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Booking Reference</span>
                <span className="block text-lg font-serif font-bold text-[#1A1512] mt-0.5">EASCC-2026-X81A</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-sm">
                Active & Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FAF6EE] border border-[#E8DFC9] flex items-center justify-center text-[#C69C6D] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">ESTATE SPACE</span>
                  <p className="font-semibold text-gray-900 mt-0.5">EASCC Grand Ballroom & Gardens</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FAF6EE] border border-[#E8DFC9] flex items-center justify-center text-[#C69C6D] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">DATE RESERVED</span>
                  <p className="font-semibold text-gray-900 mt-0.5">Thursday, June 4, 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FAF6EE] border border-[#E8DFC9] flex items-center justify-center text-[#C69C6D] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">TIMESLOT</span>
                  <p className="font-semibold text-gray-900 mt-0.5">Evening Soiree (4:00 PM - 10:00 PM)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FAF6EE] border border-[#E8DFC9] flex items-center justify-center text-[#C69C6D] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">GUEST BASELINE</span>
                  <p className="font-semibold text-gray-900 mt-0.5">380 Attendance Capacity</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#E8DFC9]/70 p-4 rounded-sm space-y-2 leading-relaxed">
              <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C69C6D]" /> Gold Package Benefits Included:
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] text-gray-600 font-light list-disc list-inside">
                <li>Bohemian crystal chandeliers illumination</li>
                <li>Red carpet arrival walkway with fresh floral borders</li>
                <li>Premium wedding stage & Poruwa structures</li>
                <li>Five-course luxury buffet (Catering Menu G)</li>
                <li>Complimentary dressing room suite for the bride & groom</li>
                <li>Traditional oil lamp (Oil & Auspicious wicks provided)</li>
              </ul>
            </div>
          </div>

          {/* Auspicious Timeline */}
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm space-y-6">
            <div>
              <h3 className="text-lg font-serif text-gray-900">Auspicious Ceremony Timeline</h3>
              <p className="text-xs text-gray-500 font-light mt-1">
                Timeline optimized for auspicious hours and maximum elegance. Finalized in coordination with your family priest.
              </p>
            </div>

            <div className="relative border-l border-[#C69C6D]/30 pl-6 ml-2 space-y-6">
              {auspiciousTimeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-[#C69C6D] border border-white rounded-full"></div>
                  <div>
                    <span className="text-[10px] font-bold text-[#C69C6D] uppercase tracking-wider block">{item.time}</span>
                    <h4 className="text-sm font-semibold text-gray-900 mt-0.5">{item.title}</h4>
                    <p className="text-xs text-gray-500 font-light mt-1 leading-normal max-w-xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Price Projections & Quick Rules */}
        <div className="lg:col-span-4 space-y-6">
          {/* Estimated costs card */}
          <div className="bg-[#1A1512] text-white border border-[#C69C6D]/20 p-6 shadow-xl rounded-sm">
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#C69C6D] block mb-2">Cost Breakdown</span>
            <h3 className="text-lg font-serif mb-4 pb-3 border-b border-white/10">Bespoke Statement</h3>

            <div className="space-y-3 text-xs font-light text-gray-300">
              <div className="flex justify-between">
                <span>Gold Package Base (380 Guests):</span>
                <span className="font-semibold text-white">LKR 3,400,000</span>
              </div>
              <div className="flex justify-between">
                <span>Evening Soiree Premium:</span>
                <span className="font-semibold text-white">LKR 100,000</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-white/10">
                <span>Extra Guest Catering Fees:</span>
                <span className="font-semibold text-white">LKR 0 (At Baseline)</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Price</span>
                <div className="text-right">
                  <span className="text-xl font-serif font-bold text-[#C69C6D]">LKR 3,500,000</span>
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Estimated Statement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Estate Guidelines */}
          <div className="bg-white border border-[#E8DFC9] p-5 rounded-sm text-xs font-light text-gray-500 space-y-4">
            <h4 className="font-serif font-semibold text-gray-900 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#C69C6D]" /> Estate Directives & Rules
            </h4>
            <div className="space-y-2.5 leading-relaxed">
              <p>
                1. <strong>Sound Level Regulations:</strong> Outdoor garden sound systems must maintain volumes under 75dB and shut down precisely at 9:30 PM. Inside the Grand Ballroom, music is allowed until 11:30 PM.
              </p>
              <p>
                2. <strong>Decor Restrictions:</strong> No nails, anchors, or damaging adhesives are allowed on the ballroom walls or Roman pillars. Flower arrangements must only use vetted freestanding stands.
              </p>
              <p>
                3. <strong>Traditional Oil Lamp:</strong> Coconut oil must be pre-filtered. A safety fire blanket is provided by EASCC and must remain stationed 2 meters from the Poruwa stage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
