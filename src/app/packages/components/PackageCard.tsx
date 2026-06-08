"use client";

import Image from "next/image";
import { PackageData } from "../data";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface Props {
  pkg: PackageData;
  isGuest: boolean;
  onViewDetails: (pkg: PackageData) => void;
  index?: number;
}

export default function PackageCard({ pkg, isGuest, onViewDetails, index = 0 }: Props) {
  const router = useRouter();
  
  return (
    <div className={`relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#D4C9A8] flex flex-col h-full group hover-lift hover-glow card-entrance stagger-${index + 1}`}>
      {/* Header Image */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <Image 
          src={pkg.images[0]}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-[#2C1E14]/80 via-transparent to-transparent pointer-events-none`}></div>
        
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-sm font-bold shadow-sm text-[#2C1E14] text-sm">
          LKR {(pkg.price / 1000000).toFixed(2)}M
        </div>
        
        <div className="absolute bottom-4 left-6">
          <h3 className={`text-3xl font-serif text-white drop-shadow-md`}>{pkg.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-gray-600 text-sm font-light leading-relaxed mb-6">{pkg.description}</p>
        
        <div className="space-y-3 mb-8 flex-1">
          {pkg.features.slice(0, 4).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
              <span className="text-gray-700 font-medium text-xs leading-relaxed">{feature}</span>
            </div>
          ))}
          {pkg.features.length > 4 && (
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider pl-7 pt-2 border-t border-[#F0E6D0]">
              + {pkg.features.length - 4} more inclusions
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="space-y-3 mt-auto">
          {isGuest ? (
            <>
              <button 
                onClick={() => onViewDetails(pkg)}
                className="w-full py-2.5 rounded-sm border border-[#2C1E14] text-[#2C1E14] text-[10px] uppercase font-bold tracking-widest hover:bg-[#2C1E14] hover:text-[#C9A84C] transition-colors btn-interactive"
              >
                View Details
              </button>
              
              <div className="relative group/tooltip">
                <button 
                  disabled
                  className="w-full py-2.5 rounded-sm bg-[#F0E6D0]/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest cursor-not-allowed flex items-center justify-center gap-2 border border-[#D4C9A8]/50"
                >
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Login to Book
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-[#2C1E14] text-[#F0E6D0] text-[10px] text-center p-2 rounded-sm opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg border border-[#C9A84C]/30">
                  You must register or sign in to start a booking.
                </div>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => onViewDetails(pkg)}
                className="w-full py-2.5 rounded-sm border border-[#2C1E14] text-[#2C1E14] text-[10px] uppercase font-bold tracking-widest hover:bg-[#2C1E14] hover:text-[#C9A84C] transition-colors btn-interactive"
              >
                Compare Features
              </button>
              
              <button 
                onClick={() => router.push(`/book?pkg=${pkg.id}`)}
                className="w-full py-2.5 rounded-sm bg-[#C9A84C] text-[#2C1E14] text-[10px] uppercase font-bold tracking-widest hover:bg-[#B89238] transition-all btn-interactive flex items-center justify-center gap-2"
              >
                Start Booking <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
