"use client";

import React from "react";
import { Award } from "lucide-react";

interface BasePackage {
  id: "silver" | "gold" | "diamond";
  name: string;
  price: string;
  priceNum: number;
  baseGuests: number;
  extraGuestFee: number;
}

export const PACKAGES_LIST: BasePackage[] = [
  {
    id: "silver",
    name: "Silver Package",
    price: "LKR 1.8M",
    priceNum: 1800000,
    baseGuests: 250,
    extraGuestFee: 5000
  },
  {
    id: "gold",
    name: "Gold Package",
    price: "LKR 3.4M",
    priceNum: 3400000,
    baseGuests: 380,
    extraGuestFee: 6000
  },
  {
    id: "diamond",
    name: "Diamond Package",
    price: "LKR 5.9M",
    priceNum: 5900000,
    baseGuests: 480,
    extraGuestFee: 8000
  }
];

interface PackageSelectorProps {
  selectedPkg: "silver" | "gold" | "diamond";
  onSelectPkg: (pkgId: "silver" | "gold" | "diamond") => void;
}

export default function PackageSelector({ selectedPkg, onSelectPkg }: PackageSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
        <Award className="w-4 h-4 text-[#c69c6d]" /> Step 3: Choose Celebration Package
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PACKAGES_LIST.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onSelectPkg(pkg.id)}
            className={`p-4 border text-left flex flex-col justify-between transition-all duration-300 rounded-sm ${
              selectedPkg === pkg.id 
                ? "border-[#c69c6d] bg-[#C69C6D]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div>
              <h5 className="text-xs font-semibold text-gray-900">{pkg.name}</h5>
              <span className="text-lg font-serif font-bold text-[#7C6A2E] block mt-1">{pkg.price}</span>
            </div>
            <span className="text-[9px] text-gray-400 mt-3">{pkg.baseGuests} Guests baseline</span>
          </button>
        ))}
      </div>
    </div>
  );
}
