import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MainNavbar from "@/components/landing/shared/MainNavbar";

export default function VirtualTourPage() {
  return (
    <div className="min-h-screen bg-[#1A1512] text-[#FAF6EE] font-sans flex flex-col">
      <MainNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-serif text-[#c69c6d]">Virtual Tour</h1>
        <p className="text-gray-400 text-lg">
          Immerse yourself in our grand ballroom. The 360-degree virtual tour experience is currently under development and will be available soon.
        </p>
        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 border border-[#c69c6d] text-[#c69c6d] px-6 py-3 hover:bg-[#c69c6d] hover:text-black transition-colors uppercase tracking-widest text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
