"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, Search, Check, Navigation, Compass } from "lucide-react";

interface LocationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (locationString: string) => void;
  initialLocation?: string;
}

const SRI_LANKA_DISTRICTS = [
  { name: "Colombo", province: "Western", coords: { x: 35, y: 70 } },
  { name: "Kandy", province: "Central", coords: { x: 50, y: 55 } },
  { name: "Galle", province: "Southern", coords: { x: 42, y: 88 } },
  { name: "Negombo", province: "Western", coords: { x: 32, y: 62 } },
  { name: "Bentota", province: "Southern", coords: { x: 38, y: 80 } },
  { name: "Jaffna", province: "Northern", coords: { x: 40, y: 15 } },
  { name: "Trincomalee", province: "Eastern", coords: { x: 72, y: 35 } },
  { name: "Nuwara Eliya", province: "Central", coords: { x: 55, y: 65 } },
  { name: "Matara", province: "Southern", coords: { x: 50, y: 92 } },
  { name: "Batticaloa", province: "Eastern", coords: { x: 78, y: 50 } },
  { name: "Anuradhapura", province: "North Central", coords: { x: 48, y: 36 } },
  { name: "Kurunegala", province: "North Western", coords: { x: 44, y: 52 } },
];

export default function LocationMapModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialLocation = "",
}: LocationMapModalProps) {
  const [selectedCity, setSelectedCity] = useState<string>(initialLocation || "Colombo, Western Province");
  const [customAddress, setCustomAddress] = useState<string>(initialLocation || "");
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number }>({ x: 35, y: 70 });
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (initialLocation) {
      setCustomAddress(initialLocation);
      const matched = SRI_LANKA_DISTRICTS.find(d => 
        initialLocation.toLowerCase().includes(d.name.toLowerCase())
      );
      if (matched) {
        setMarkerPos(matched.coords);
        setSelectedCity(`${matched.name}, ${matched.province} Province`);
      }
    }
  }, [initialLocation, isOpen]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    setMarkerPos({ x, y });

    // Find nearest district
    let nearest = SRI_LANKA_DISTRICTS[0];
    let minDist = Infinity;
    SRI_LANKA_DISTRICTS.forEach(d => {
      const dist = Math.hypot(d.coords.x - x, d.coords.y - y);
      if (dist < minDist) {
        minDist = dist;
        nearest = d;
      }
    });

    const locationName = `${nearest.name}, Sri Lanka`;
    setSelectedCity(`${nearest.name}, ${nearest.province} Province`);
    if (!customAddress || customAddress === initialLocation) {
      setCustomAddress(`${nearest.name}, Sri Lanka`);
    }
  };

  const handleSelectDistrict = (district: typeof SRI_LANKA_DISTRICTS[0]) => {
    setMarkerPos(district.coords);
    setSelectedCity(`${district.name}, ${district.province} Province`);
    setCustomAddress(`${district.name}, Sri Lanka`);
  };

  const handleConfirm = () => {
    const finalLocation = customAddress.trim() || selectedCity;
    onSelectLocation(finalLocation);
    onClose();
  };

  const filteredDistricts = SRI_LANKA_DISTRICTS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF6EE] dark:bg-[#141414] border border-[#E0D8C3] dark:border-gray-800 rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0D8C3] dark:border-gray-800 flex items-center justify-between bg-[#F5EFE0]/50 dark:bg-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#7C6A2E] dark:text-[#C9A84C]" />
            <h3 className="font-serif italic font-bold text-lg text-[#7C6A2E] dark:text-[#C9A84C]">
              Select Service Location (Sri Lanka)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Interactive Map Visual */}
            <div className="md:col-span-7 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7C6A2E] dark:text-[#C9A84C] flex items-center gap-1.5">
                  <Compass size={14} /> Click Map to Drop Pin
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  Coordinates: {markerPos.x}°E, {markerPos.y}°N
                </span>
              </div>

              {/* Map Container */}
              <div
                onClick={handleMapClick}
                className="relative w-full h-80 bg-[#E3DAC9] dark:bg-[#1C2024] rounded-xl border-2 border-[#7C6A2E]/40 overflow-hidden cursor-crosshair shadow-inner group"
              >
                {/* Decorative Map Background Grid Lines */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Coastal Line / Island Vector Representation */}
                <svg className="absolute inset-0 w-full h-full opacity-30 text-[#7C6A2E] dark:text-gray-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M40 10 C 50 15, 75 25, 75 45 C 75 65, 55 95, 45 95 C 35 95, 30 75, 30 55 C 30 35, 35 10, 40 10 Z" fill="currentColor" />
                </svg>

                {/* Major City Fixed Dots */}
                {SRI_LANKA_DISTRICTS.map((d, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDistrict(d);
                    }}
                    style={{ left: `${d.coords.x}%`, top: `${d.coords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group/dot cursor-pointer"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7C6A2E] dark:bg-[#C9A84C] border border-white shadow-sm group-hover/dot:scale-150 transition-transform" />
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-white/90 dark:bg-black/90 px-1.5 py-0.5 rounded shadow whitespace-nowrap text-gray-800 dark:text-gray-200 opacity-0 group-hover/dot:opacity-100 transition-opacity">
                      {d.name}
                    </span>
                  </div>
                ))}

                {/* Active Placed Pin */}
                <div
                  style={{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-none drop-shadow-lg"
                >
                  <div className="relative animate-bounce">
                    <MapPin className="w-8 h-8 text-red-600 fill-red-500" />
                    <div className="w-2 h-2 rounded-full bg-black/40 blur-xs absolute -bottom-1 left-3" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 bg-white/80 dark:bg-black/80 text-[10px] font-bold px-2 py-1 rounded border border-gray-200 dark:border-gray-800 backdrop-blur-xs text-gray-700 dark:text-gray-300">
                  📍 Click map to set pin location
                </div>
              </div>
            </div>

            {/* District Quick List & Address Entry */}
            <div className="md:col-span-5 flex flex-col space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1">
                  Full Business Address / City
                </label>
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="e.g. 120 Galle Road, Colombo 03"
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-white dark:bg-[#1A1A1A] px-3.5 py-2.5 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
              </div>

              {/* District Search */}
              <div className="flex flex-col flex-1 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Or Quick Select District
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Sri Lanka cities..."
                    className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-white dark:bg-[#1A1A1A] pl-9 pr-3 py-2 rounded-lg text-xs text-gray-800 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                  />
                </div>

                <div className="h-44 overflow-y-auto border border-[#E0D8C3] dark:border-gray-800 rounded-lg bg-white dark:bg-[#1A1A1A] divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredDistricts.map((d, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectDistrict(d)}
                      className={`p-2.5 flex items-center justify-between text-xs cursor-pointer hover:bg-[#FAF6EE] dark:hover:bg-white/5 transition-colors ${
                        selectedCity.startsWith(d.name) ? "bg-[#FAF6EE] dark:bg-white/10 font-bold text-[#7C6A2E] dark:text-[#C9A84C]" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Navigation size={12} className="text-gray-400" />
                        <span>{d.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-normal">{d.province} Prov.</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Selection Badge */}
              <div className="bg-[#FAF6EE] dark:bg-[#1E1E1E] p-3 rounded-lg border border-[#E0D8C3] dark:border-gray-800 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#7C6A2E] dark:text-[#C9A84C] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">
                    Selected Location
                  </span>
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {customAddress || selectedCity}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0D8C3] dark:border-gray-800 flex justify-end gap-3 bg-[#F5EFE0]/50 dark:bg-[#1A1A1A]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-[#E0D8C3] text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-[#7C6A2E] hover:bg-[#5E4F20] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <Check size={16} /> Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
