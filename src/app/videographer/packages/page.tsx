"use client";

import React from "react";
import Sidebar from "@/components/videographer/shared/Sidebar";
import PackagesMain from "@/components/videographer/packages/PackagesMain";

export default function VideographerPackagesPage() {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
        <PackagesMain />
      </div>
    </div>
  );
}
