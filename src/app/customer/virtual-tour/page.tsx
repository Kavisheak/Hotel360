"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, View, Cuboid } from "lucide-react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Tour360Viewer from "@/components/landing/virtual-tour/Tour360Viewer";
import SpaceArrangement3D from "@/components/landing/virtual-tour/SpaceArrangement3D";

export default function VirtualTourPage() {
  const [activeTab, setActiveTab] = useState<"360" | "3d">("360");
  const [eventType, setEventType] = useState<string>("Wedding");
  const [guestCount, setGuestCount] = useState<number>(100);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1512] font-sans flex flex-col">
      <MainNavbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col pt-24 md:pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#E8DFC9] pb-6 gap-4">
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-[#1A1512]">Virtual Experience</h1>
            <p className="text-gray-600 mt-2">Explore our spaces and plan your perfect event layout.</p>
          </div>
          
          <div className="flex bg-white border border-[#E8DFC9] rounded-md p-1">
            <button
              onClick={() => setActiveTab("360")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium transition-colors ${
                activeTab === "360" 
                  ? "bg-[#C69C6D] text-white" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <View className="w-4 h-4" />
              360° Tour
            </button>
            <button
              onClick={() => setActiveTab("3d")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium transition-colors ${
                activeTab === "3d" 
                  ? "bg-[#C69C6D] text-white" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Cuboid className="w-4 h-4" />
              3D Space Arranger
            </button>
          </div>
        </div>

        {activeTab === "360" ? (
          <div className="flex-1 w-full flex flex-col">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E8DFC9] mb-4">
              <p className="text-sm text-gray-600">Navigate through 10 unique locations inside our Grand Hall.</p>
            </div>
            <Tour360Viewer />
          </div>
        ) : (
          <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-[#E8DFC9] h-fit">
              <h3 className="font-serif text-xl mb-6">Event Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#FAF6EE] border border-[#E8DFC9] rounded px-4 py-2.5 outline-none focus:border-[#C69C6D]"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Meeting">Meeting / Conference</option>
                    <option value="Birthday Party">Birthday Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
                    <span>Participant Count</span>
                    <span className="text-[#C69C6D]">{guestCount} Guests</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full accent-[#C69C6D]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>
                
                <hr className="border-[#E8DFC9]" />
                
                <div className="text-sm text-gray-600">
                  <p><strong>Arrangement Style:</strong></p>
                  <p className="mt-1">
                    {eventType === "Meeting" ? "Theater seating with stage" : "Banquet style with round tables (8 guests/table)"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <SpaceArrangement3D eventType={eventType} guestCount={guestCount} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
