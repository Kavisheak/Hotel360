"use client";

import React from "react";
import { Package } from "lucide-react";

interface PackageSelectorProps {
  selectedPackage: string;
  onSelectPackage: (p: string) => void;
  dbPackages?: any[];
}

export default function PackageSelector({ selectedPackage, onSelectPackage, dbPackages }: PackageSelectorProps) {
  const pkgs = dbPackages && dbPackages.length > 0
    ? dbPackages.map((pkg: any) => {
        const nameLower = pkg.name.toLowerCase();
        let slug = "gold";
        if (nameLower.includes("silver")) slug = "silver";
        else if (nameLower.includes("diamond")) slug = "diamond";

        return {
          id: slug,
          name: pkg.name,
          base: `LKR ${pkg.price.toLocaleString()}`,
          pax: `${pkg.maxGuests} Guests included`
        };
      }).sort((a, b) => {
        const order = { "silver": 1, "gold": 2, "diamond": 3 };
        return (order[a.id as keyof typeof order] || 4) - (order[b.id as keyof typeof order] || 4);
      })
    : [
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
    <div className="space-y-6">
      <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5 mb-2">
        <Package className="w-4 h-4 text-[#A6955C]" /> STEP 3: SELECT BASELINE FRAMEWORK
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pkgs.map((pkg) => {
          const isActive = selectedPackage === pkg.id;
          return (
            <div 
              key={pkg.id}
              onClick={() => onSelectPackage(pkg.id)}
              className={`
                p-5 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center text-center rounded-sm
                ${isActive 
                  ? "bg-white dark:bg-[#111] border-2 border-[#C69C6D] shadow-sm z-10" 
                  : "bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-gray-800 hover:border-[#A6955C]"
                }
              `}
            >
              <h4 className={`font-serif text-[17px] font-semibold mb-1 ${isActive ? "text-[#C69C6D]" : "text-[#1A1512] dark:text-white"}`}>{pkg.name}</h4>
              <span className={`text-[10px] font-bold tracking-widest uppercase block mb-2 ${isActive ? "text-[#C69C6D]" : "text-[#A6955C]"}`}>
                {pkg.base} BASE
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 italic mt-3 pb-4">
        * You can fully customize menu, florals, and entertainment within your client portal after holding the date.
      </p>
    </div>
  );
}
