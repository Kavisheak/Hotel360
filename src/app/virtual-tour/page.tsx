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
  const [isPublic, setIsPublic] = useState<boolean | null>(null);
  const { guestCount, setGuestCount, setArrangementStyle } = useLayoutStore();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/virtual-config`)
      .then(res => res.json())
      .then(data => {
        setIsPublic(data.success ? data.isPublic !== false : true);
      })
      .catch(() => setIsPublic(true));
  }, []);

  // Sync event type with arrangement style
  useEffect(() => {
    if (eventType === "Wedding") setArrangementStyle("Banquet");
    else if (eventType === "Meeting") setArrangementStyle("Theater");
    else if (eventType === "Seminar") setArrangementStyle("Classroom");
  }, [eventType, setArrangementStyle]);

  if (isPublic === false) {
    return (
      <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#1A1512] dark:text-white">
        <MainNavbar />
        <main className="flex-grow flex items-center justify-center px-6 pt-36 pb-20">
          <div className="max-w-md w-full text-center bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-white/10 p-10 rounded-sm shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF6EE] dark:bg-[#252525] border border-[#C9A84C]/40 mx-auto flex items-center justify-center mb-5 text-[#C9A84C]">
              <View className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#C9A84C] uppercase mb-2">Notice</p>
            <h2 className="text-2xl font-serif font-bold text-[#2C1E14] dark:text-white mb-3">
              Virtual Experience Offline
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-6">
              Our 360° virtual tour is temporarily offline while we update our spatial arrangements. We warmly invite you to explore our packages or contact our concierge.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#C9A84C] text-black text-[10px] font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
            >
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#1A1512] dark:text-white transition-colors duration-300">
      <MainNavbar />
      
      <main className="flex-grow pb-0">
        <div className="max-w-7xl mx-auto px-6 pt-28 md:pt-40 pb-16 section-reveal">
        <div className="flex flex-col mb-8">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 stagger-1">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A1512] dark:text-white mb-2">Virtual Experience</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-light">Immerse yourself in our conference hall with panoramic views and interactive navigation.</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("360")}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all btn-interactive border ${
                  activeTab === "360" 
                    ? "bg-[#C69C6D] border-[#C69C6D] text-white shadow-md" 
                    : "bg-transparent border-[#E8DFC9] dark:border-gray-700 text-[#1A1512] dark:text-gray-300 hover:border-[#C69C6D] hover:text-[#C69C6D]"
                }`}
              >
                <View className="w-4 h-4" />
                360° Tour
              </button>
              <button
                onClick={() => setActiveTab("3d")}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all btn-interactive border ${
                  activeTab === "3d" 
                    ? "bg-[#C69C6D] border-[#C69C6D] text-white shadow-md" 
                    : "bg-transparent border-[#E8DFC9] dark:border-gray-700 text-[#1A1512] dark:text-gray-300 hover:border-[#C69C6D] hover:text-[#C69C6D]"
                }`}
              >
                <Cuboid className="w-4 h-4" />
                3D Space Arranger
              </button>
            </div>
          </div>
        </div>

        {activeTab === "360" ? (
          <div className="flex flex-col w-full stagger-2">
            

            <div className="border border-[#D4C9A8] dark:border-[#C9A84C]/40 shadow-xl dark:shadow-[#C9A84C]/5 rounded-sm overflow-hidden hover-glow transition-all duration-300">
              <Tour360Viewer />
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-6 stagger-2">
            <div className="lg:col-span-1 bg-white dark:bg-gradient-to-br dark:from-[#382B14] dark:via-[#1A1610] dark:to-[#0D0B08] p-6 rounded-sm shadow-md dark:shadow-[#C9A84C]/5 border border-[#D4C9A8] dark:border-[#C9A84C]/40 h-fit hover-lift hover-glow transition-all duration-300">
              <h3 className="font-serif text-xl mb-6 text-[#2C1E14] dark:text-white">Event Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-300 mb-2">
                    Event Type
                  </label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A1A1A]/80 border border-[#D4C9A8] dark:border-[#C9A84C]/30 rounded-sm px-4 py-2.5 text-sm text-[#2C1E14] dark:text-white outline-none focus:border-[#C9A84C] transition-colors input-glow"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Meeting">Meeting / Conference</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-300 mb-2 flex justify-between">
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
                  <div className="flex justify-between text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-2">
                    <span>10 min</span>
                    <span>500 max</span>
                  </div>
                </div>
                
                <hr className="border-[#D4C9A8] dark:border-[#C9A84C]/20" />
                
                <div className="text-xs text-gray-600 dark:text-gray-300 bg-[#F0E6D0]/50 dark:bg-[#1A1A1A]/50 p-4 rounded-sm border border-[#D4C9A8] dark:border-[#C9A84C]/30">
                  <p className="font-bold uppercase tracking-wider text-[10px] text-[#A67C52] mb-1">Arrangement Style:</p>
                  <p className="leading-relaxed font-light">
                    {eventType === "Meeting" ? "Theater seating with stage" : 
                     eventType === "Seminar" ? "Classroom setup with study tables" : 
                     "Banquet style with round tables (8 guests/table)"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 border border-[#E8DFC9] dark:border-gray-800 shadow-xl rounded-xl overflow-hidden hover-glow transition-all duration-300">
              <SpaceArrangement3D />
            </div>
          </div>
        )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
