"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import PanoramaTour with no SSR (uses browser APIs like fullscreen, pointer events)
const PanoramaTour = dynamic(
  () => import("@/components/landing/virtual-tour/PanoramaTour"),
  { ssr: false, loading: () => (
    <div className="w-full h-[600px] bg-[#0a0a0a] rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#C69C6D] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#C69C6D] text-xs uppercase tracking-[0.2em] font-semibold">Loading Virtual Tour...</p>
      </div>
    </div>
  )}
);

export default function Tour360Viewer() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#E8DFC9] dark:border-gray-800 shadow-sm">
      <PanoramaTour />
    </div>
  );
}
