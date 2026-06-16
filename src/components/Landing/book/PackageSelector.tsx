"use client";

import React from "react";
import { Package } from "lucide-react";

interface PackageSelectorProps {
  selectedPackage: string;
  onSelectPackage: (p: string) => void;
}

export default function PackageSelector({ selectedPackage, onSelectPackage }: PackageSelectorProps) {
  const pkgs = [
    {
      id: "silver",
      name: "Silver Essential",
      base: "LKR 1.8M",
      pax: "250 Guests included"
    },
    {
      id: "gold",
      name: "Gold Signature",
      base: "LKR 3.4M",
      pax: "380 Guests included"
    },
    {
      id: "diamond",
      name: "Diamond Elite",
      base: "LKR 5.9M",
      pax: "480 Guests included"
    }
  ];

  return (
    <div className="space-y-4 hover-glow p-4 rounded-sm transition-all duration-300 bg-[#111111] border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]">
      <label className="block text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold flex items-center gap-1.5 mb-2">
        <Package className="w-4 h-4 text-[#C9A84C]" /> Step 3: Select Baseline Framework
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {pkgs.map((pkg) => {
          const isActive = selectedPackage === pkg.id;
          return (
            <div 
              key={pkg.id}
              onClick={() => onSelectPackage(pkg.id)}
              className={`
                p-5 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center text-center rounded-sm hover-glow relative
                ${isActive 
                  ? "bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] border-[#C9A84C] text-black shadow-lg ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#0A0A0A] scale-[1.03] z-10" 
                  : "bg-[#1A1A1A] border border-[#C9A84C]/30 text-white hover:border-[#C9A84C]/80 text-[#C9A84C]"
                }
              `}
            >
              <h4 className={`font-serif text-lg mb-1 ${isActive ? "text-black" : "text-white"}`}>{pkg.name}</h4>
              <span className={`text-xs font-bold tracking-widest uppercase block mb-2 ${isActive ? "text-black/80" : "text-[#C9A84C]"}`}>
                {pkg.base} base
              </span>
              <p className={`text-[10px] font-light ${isActive ? "text-black/70" : "text-gray-400"}`}>
                {pkg.pax}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-500 italic mt-2">
        * You can fully customize menus, florals, and entertainment within your client portal after holding the date.
      </p>
    </div>
  );
}
