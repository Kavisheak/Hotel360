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
    <div className="space-y-4 hover-glow p-4 rounded-sm transition-all duration-300">
      <label className="block text-[10px] uppercase tracking-widest text-[#A67C52] font-bold flex items-center gap-1.5 mb-2">
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
                p-5 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center text-center rounded-sm hover-lift
                ${isActive 
                  ? "bg-[#2C1E14] text-white shadow-lg ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#F0E6D0]" 
                  : "bg-white border border-[#D4C9A8] text-gray-900 hover:border-[#C9A84C]"
                }
              `}
            >
              <h4 className="font-serif text-lg mb-1">{pkg.name}</h4>
              <span className={`text-xs font-bold tracking-widest uppercase block mb-2 ${isActive ? "text-[#C9A84C]" : "text-[#A67C52]"}`}>
                {pkg.base} base
              </span>
              <p className={`text-[10px] font-light ${isActive ? "text-gray-400" : "text-gray-500"}`}>
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
