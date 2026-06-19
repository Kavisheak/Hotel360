import React from 'react';
import Image from 'next/image';

const compareData = [
  { feature: "Venue Access", silver: "4 Hours (Ballroom)", gold: "8 Hours (Ballroom & Terrace)", diamond: "Full Day (Ballroom, Foyer, Garden)" },
  { feature: "Culinary Tier", silver: "Classic Buffet (3 main)", gold: "Signature Buffet (5 main)", diamond: "Grand Gourmet & Live Carving Station" },
  { feature: "Welcome Beverages", silver: "Standard welcome drinks", gold: "Premium mocktails", diamond: "Molecular mixology cocktails" },
  { feature: "Decor & Backdrops", silver: "Elegant stage & drape", gold: "Suspended ceiling florals & runway", diamond: "Bespoke architectural builds & custom dancefloor" },
  { feature: "Sound & Lighting", silver: "Standard House PA & warm", gold: "Intelligent LED rigs & wash", diamond: "Club-spec sound, lasers, map overly" },
  { feature: "VIP & Coordination", silver: "On-day event coordinator", gold: "Concierge & full rehearsal team", diamond: "Personal Bridal Liaison & full planning support" },
  { feature: "Suites & Lounging", silver: "Bridal changing suite", gold: "Bridal Day-Use Suite", diamond: "Overnight Executive Suite + Couple Breakfast" },
  { feature: "Corkage & Rental", silver: "Standard corkage fee", gold: "Complimentary corkage for wine", diamond: "Fully complimentary corkage & bartending" }
];

export default function CompareFrameworks() {
  return (
    <section className="w-full bg-[#F0E6D0] dark:bg-[#0A0A0A] py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Table Side */}
        <div className="lg:col-span-8">
          <p className="text-[#805D3A] dark:text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
            Detailed Analysis
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E14] dark:text-white mb-10">
            Compare Frameworks
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#D4C9A8] dark:border-[#C9A84C]/20">
                  <th className="py-4 pr-4 text-[10px] uppercase tracking-widest text-[#2C1E14] dark:text-white font-bold w-1/4">Feature / Service</th>
                  <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold w-1/4">Silver</th>
                  <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-[#805D3A] dark:text-[#C9A84C] font-bold w-1/4">Gold</th>
                  <th className="py-4 pl-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold w-1/4">Diamond</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4C9A8]/50 dark:divide-white/10">
                {compareData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    <td className="py-5 pr-4 text-xs font-bold text-[#2C1E14] dark:text-white">{row.feature}</td>
                    <td className="py-5 px-4 text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{row.silver}</td>
                    <td className="py-5 px-4 text-xs text-[#805D3A] dark:text-[#C9A84C] font-bold leading-relaxed">{row.gold}</td>
                    <td className="py-5 pl-4 text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{row.diamond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Image Side */}
        <div className="lg:col-span-4 relative h-[600px] rounded-sm overflow-hidden shadow-xl hidden lg:block">
          <Image 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"
            alt="Elegant Dining Table"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
