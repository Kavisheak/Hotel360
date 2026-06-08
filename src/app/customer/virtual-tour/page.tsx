"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, View, Cuboid } from "lucide-react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import Tour360Viewer from "@/components/landing/virtual-tour/Tour360Viewer";
import SpaceArrangement3D from "@/components/landing/virtual-tour/SpaceArrangement3D";
import { useLayoutStore } from "@/store/useLayoutStore";

export default function VirtualTourPage() {
  const [activeTab, setActiveTab] = useState<"360" | "3d">("360");
  const [eventType, setEventType] = useState<string>("Wedding");
  const { guestCount, setGuestCount, setArrangementStyle } = useLayoutStore();

  // Sync event type with arrangement style
  useEffect(() => {
    if (eventType === "Wedding") setArrangementStyle("Banquet");
    else if (eventType === "Meeting") setArrangementStyle("Theater");
    else if (eventType === "Birthday Party") setArrangementStyle("Banquet");
  }, [eventType, setArrangementStyle]);

  return (
    <div className="bg-[#F0E6D0] min-h-screen flex flex-col font-sans text-[#2C1E14]">
      <MainNavbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col pt-8 md:pt-12 section-reveal">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#D4C9A8] pb-6 gap-4 stagger-1">
          <div>
            <Link 
              href="/customer/home"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#2C1E14] transition-colors mb-4 btn-interactive"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2C1E14]">Virtual Experience</h1>
            <p className="text-gray-600 mt-2 text-sm font-light">Explore our spaces and plan your perfect event layout.</p>
          </div>
          
          <div className="flex bg-white border border-[#D4C9A8] rounded-sm p-1 shadow-sm hover-glow transition-all">
            <button
              onClick={() => setActiveTab("360")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors btn-interactive ${
                activeTab === "360" 
                  ? "bg-[#C9A84C] text-[#2C1E14]" 
                  : "text-gray-600 hover:bg-[#F0E6D0]/50"
              }`}
            >
              <View className="w-4 h-4" />
              360° Tour
            </button>
            <button
              onClick={() => setActiveTab("3d")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors btn-interactive ${
                activeTab === "3d" 
                  ? "bg-[#C9A84C] text-[#2C1E14]" 
                  : "text-gray-600 hover:bg-[#F0E6D0]/50"
              }`}
            >
              <Cuboid className="w-4 h-4" />
              3D Space Arranger
            </button>
          </div>
        </div>

        {activeTab === "360" ? (
          <div className="flex-1 w-full flex flex-col stagger-2">
            <div className="bg-white p-4 rounded-sm shadow-sm border border-[#D4C9A8] mb-4 hover-lift hover-glow transition-all">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Navigate through 10 unique locations inside our Grand Hall.</p>
            </div>
            <div className="border border-[#D4C9A8] shadow-xl rounded-sm overflow-hidden hover-glow transition-all duration-300">
              <Tour360Viewer />
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-6 stagger-2">
            <div className="lg:col-span-1 bg-white p-6 rounded-sm shadow-sm border border-[#D4C9A8] h-fit hover-lift hover-glow transition-all">
              <h3 className="font-serif text-xl mb-6 text-[#2C1E14]">Event Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#F0E6D0]/30 border border-[#D4C9A8] rounded-sm px-4 py-2.5 text-sm outline-none focus:border-[#C9A84C] transition-colors input-glow"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Meeting">Meeting / Conference</option>
                    <option value="Birthday Party">Birthday Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-700 mb-2 flex justify-between">
                    <span>Participant Count</span>
                    <span className="text-[#A67C52]">{guestCount} Guests</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                  />
                  <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-2">
                    <span>10 min</span>
                    <span>500 max</span>
                  </div>
                </div>
                
                <hr className="border-[#F0E6D0]" />
                
                <div className="text-xs text-gray-600 bg-[#F0E6D0]/20 p-4 rounded-sm border border-[#D4C9A8]/50">
                  <p className="font-bold uppercase tracking-wider text-[10px] text-[#A67C52] mb-1">Arrangement Style:</p>
                  <p className="leading-relaxed font-light">
                    {eventType === "Meeting" ? "Theater seating with stage" : "Banquet style with round tables (8 guests/table)"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 border border-[#D4C9A8] shadow-xl rounded-sm overflow-hidden hover-glow transition-all duration-300">
              <SpaceArrangement3D />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
