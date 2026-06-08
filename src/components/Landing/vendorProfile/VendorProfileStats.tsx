import React from "react";
import { Vendor } from "@/components/landing/vendors/types";

interface VendorProfileStatsProps {
  vendor: Vendor;
}

export default function VendorProfileStats({ vendor }: VendorProfileStatsProps) {
  return (
    <div className="bg-white border-b border-[#E8DFC9]">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-between items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pricing Tier</span>
          <span className="text-lg font-serif text-[#1A1512]">{vendor.priceLevelLabel}</span>
        </div>
        
        <div className="w-px h-10 bg-[#E8DFC9] hidden md:block" />

        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Starting Price</span>
          <span className="text-lg font-serif text-[#1A1512]">{vendor.startingPrice}</span>
        </div>

        <div className="w-px h-10 bg-[#E8DFC9] hidden md:block" />

        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Years Experience</span>
          <span className="text-lg font-serif text-[#1A1512]">{((vendor as any).experience) || "5+ Years"}</span>
        </div>

        <div className="w-px h-10 bg-[#E8DFC9] hidden md:block" />

        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Events Completed</span>
          <span className="text-lg font-serif text-[#1A1512]">{((vendor as any).eventsCompleted) || "120+"}</span>
        </div>
      </div>
    </div>
  );
}
