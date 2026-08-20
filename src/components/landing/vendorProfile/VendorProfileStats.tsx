import React from "react";
import { Vendor } from "@/components/landing/vendors/types";
import { Settings, CalendarCheck } from "lucide-react";

interface VendorProfileStatsProps {
  vendor: Vendor;
}

export default function VendorProfileStats({ vendor }: VendorProfileStatsProps) {
  return (
    <div className="bg-white dark:bg-[#111315] border-b border-[#E8DFC9] dark:border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Years Experience */}
        <div className="flex items-center gap-4 flex-1 justify-center md:justify-start">
          <div className="p-2 border border-[#C69C6D]/30 rounded-sm">
            <Settings className="w-5 h-5 text-[#C69C6D]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Years Experience</span>
            <span className="text-lg font-serif text-[#1A1512] dark:text-white leading-tight">{vendor.experience ? `${vendor.experience} Years` : "-"}</span>
          </div>
        </div>

        <div className="w-full md:w-px h-[1px] md:h-12 bg-[#E8DFC9] dark:bg-white/10" />

        {/* Events Completed */}
        <div className="flex items-center gap-4 flex-1 justify-center md:justify-start md:pl-6">
          <div className="p-2 border border-[#C69C6D]/30 rounded-sm">
            <CalendarCheck className="w-5 h-5 text-[#C69C6D]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Events Completed</span>
            <span className="text-lg font-serif text-[#1A1512] dark:text-white leading-tight">{vendor.eventsCompleted || "-"}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
