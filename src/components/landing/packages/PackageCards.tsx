import React, { useState, useEffect, useRef } from "react";
import { Check, Leaf, Crown, Diamond as DiamondIcon, ArrowRight, ChevronDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { SIGNATURE_PACKAGES } from "./types";

interface PackageCardsProps {
  activePackage: string;
  setActivePackage: (id: any) => void;
  packages?: any[];
  onSelect?: (pkgId: string, pkgName: string) => void;
  isCompact?: boolean;
}

export default function PackageCards({ activePackage, setActivePackage, packages, onSelect, isCompact }: PackageCardsProps) {
  const router = useRouter();
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const displayPackages = (packages && packages.length > 0 ? packages : SIGNATURE_PACKAGES).sort((a, b) => {
    const getRank = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("silver")) return 1;
      if (lower.includes("gold")) return 2;
      if (lower.includes("diamond")) return 3;
      return 4; // Any other packages go last
    };
    return getRank(a.name) - getRank(b.name);
  });

  useEffect(() => {
    // Scroll to the second (Gold) package on mobile mount
    if (window.innerWidth < 768 && scrollContainerRef.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        if (container) {
          const cardWidth = window.innerWidth * 0.75; // 75vw
          const gap = 24; // 1.5rem
          const leftPadding = 24; // px-6
          const scrollPos = leftPadding + cardWidth + gap - ((window.innerWidth - cardWidth) / 2);
          container.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [displayPackages]);
  
  const showToastAndNavigate = (pkgId: string, pkgName: string) => {
    if (onSelect) {
      onSelect(pkgId, pkgName);
    } else {
      // Navigate immediately - toast will be shown on the destination page
      router.push(`/book?package=${pkgId}&fromSelect=true`);
    }
  };


  const getCardTheme = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("silver")) {
      return {
        bg: "bg-[#F5F6F8]",
        textTitle: "text-[#8899A6]",
        textPrice: "text-[#3D4C53]",
        textLabel: "text-[#8899A6]",
        Icon: Leaf,
        ribbonOuter: "bg-[#D1D9E0]",
        ribbonInner: "bg-[#E6ECF0]",
        shadow: "shadow-[10px_10px_30px_#d1d9e6,_-10px_-10px_30px_#ffffff]",
        iconShadow: "shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#ffffff,5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff]",
      };
    }
    if (lower.includes("gold")) {
      return {
        bg: "bg-[#FAEFDF]",
        textTitle: "text-[#B38D4F]",
        textPrice: "text-[#5C4520]",
        textLabel: "text-[#B38D4F]",
        Icon: Crown,
        ribbonOuter: "bg-[#D19A3B]",
        ribbonInner: "bg-[#EBC781]",
        shadow: "shadow-[10px_10px_30px_#e5d7c3,_-10px_-10px_30px_#ffffff]",
        iconShadow: "shadow-[inset_2px_2px_5px_#e5d7c3,_inset_-2px_-2px_5px_#ffffff,5px_5px_10px_#e5d7c3,_-5px_-5px_10px_#ffffff]",
      };
    }
    return {
      bg: "bg-[#F0F4F8]",
      textTitle: "text-[#657F93]",
      textPrice: "text-[#2B3B47]",
      textLabel: "text-[#657F93]",
      Icon: DiamondIcon,
      ribbonOuter: "bg-[#4A6478]",
      ribbonInner: "bg-[#809BB0]",
      shadow: "shadow-[10px_10px_30px_#d0d9e3,_-10px_-10px_30px_#ffffff]",
      iconShadow: "shadow-[inset_2px_2px_5px_#d0d9e3,_inset_-2px_-2px_5px_#ffffff,5px_5px_10px_#d0d9e3,_-5px_-5px_10px_#ffffff]",
    };
  };

  return (
    <section className={`max-w-7xl mx-auto px-6 relative z-20 ${isCompact ? "py-4 md:py-8" : "py-16 md:py-24"}`}>
      <div ref={scrollContainerRef} className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-6 md:gap-10 lg:gap-14 pb-12 md:pb-0 -ml-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-[100vw] sm:w-full md:w-full">
        {displayPackages.map((pkg, index) => {
          const isActive = activePackage === pkg.id;
          const displayGuests = pkg.guests.toLowerCase().includes("guest") ? pkg.guests : `${pkg.guests} Guests`;
          const theme = getCardTheme(pkg.name);
          const Icon = theme.Icon;
          
          return (
            <div 
              key={pkg.id}
              onClick={() => setActivePackage(pkg.id as any)}
              className="relative w-full h-[480px] md:h-[600px] perspective-[2000px] group cursor-pointer min-w-[75vw] sm:min-w-[60vw] md:min-w-0 snap-center shrink-0"
            >
              <div className={`w-full h-full relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] ${flippedCard === pkg.id ? '[transform:rotateY(180deg)]' : ''} ${isActive ? 'scale-105' : 'hover:scale-[1.02]'}`}>
                
                {/* --- FRONT FACE --- */}
                <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[2.5rem] ${theme.bg} ${theme.shadow} flex flex-col items-center justify-between p-6 md:p-10 overflow-hidden ${flippedCard === pkg.id ? 'pointer-events-none' : 'pointer-events-auto md:group-hover:pointer-events-none'}`}>
                  
                  {/* Decorative Ribbons on the right edge */}
                  <div className={`absolute top-0 right-0 w-[60px] h-full ${theme.ribbonOuter} opacity-80 rounded-l-[100%] translate-x-4`}></div>
                  <div className={`absolute top-[5%] right-0 w-[40px] h-[90%] ${theme.ribbonInner} rounded-l-[100%] translate-x-2`}></div>
                  
                  {/* MOST CHOSEN Badge removed as per request */}

                  {/* Icon Badge */}
                  <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center ${theme.iconShadow} mt-4 relative z-10`}>
                    <Icon className={`w-8 h-8 ${theme.textTitle}`} strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <div className="text-center mt-6 relative z-10">
                    <h3 className={`text-2xl font-serif uppercase tracking-[0.15em] ${theme.textTitle}`}>
                      {pkg.name.split(' ')[0]}
                    </h3>
                    <p className={`text-[9px] uppercase tracking-[0.3em] ${theme.textLabel} mt-1 font-semibold`}>Package</p>
                    <div className="w-1.5 h-1.5 rotate-45 border border-current mx-auto mt-4 opacity-40 text-current"></div>
                  </div>

                  {/* Price & Guests */}
                  <div className="text-center mt-2 md:mt-6 relative z-10">
                    <h2 className={`text-3xl md:text-4xl font-serif ${theme.textPrice} leading-none`}>
                      {pkg.price}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className={`text-[10px] md:text-[11px] leading-relaxed text-center font-medium mt-2 md:mt-6 px-4 ${theme.textLabel} relative z-10 opacity-90`}>
                    {pkg.description}
                  </p>

                  {/* View Details Fake Button & Arrow */}
                  <div className="mt-8 w-full relative z-10 flex flex-col items-center gap-6">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlippedCard(pkg.id);
                      }}
                      className={`border border-current rounded-full px-8 py-3 flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold ${theme.textTitle} opacity-70 cursor-pointer`}
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <ChevronDown className={`w-5 h-5 ${theme.textTitle} opacity-30`} />
                  </div>
                </div>

                {/* --- BACK FACE --- */}
                <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[2.5rem] ${theme.bg} ${theme.shadow} flex flex-col p-6 md:p-10 overflow-hidden md:group-hover:pointer-events-auto ${flippedCard === pkg.id ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                  
                  {/* Mobile flip back button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlippedCard(null);
                    }}
                    className={`md:hidden absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 ${theme.textTitle} z-50`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  {/* Decorative faint background icon */}
                  <Icon className={`absolute -right-10 -bottom-10 w-64 h-64 ${theme.textTitle} opacity-5`} strokeWidth={0.5} />

                  <h3 className={`text-lg font-serif uppercase tracking-widest ${theme.textTitle} mb-6 border-b border-current pb-4 opacity-70 text-center`}>
                    {pkg.name.split(' ')[0]} Features
                  </h3>

                  {/* Features List */}
                  <div className="space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 text-center md:text-left">
                    {pkg.features.map((feature: string, idx: number) => (
                      <div key={idx} className={`flex items-center md:items-start justify-center md:justify-start gap-2 md:gap-3 text-xs ${theme.textPrice} font-medium`}>
                        <Check className={`w-4 h-4 ${theme.textTitle} shrink-0 md:mt-0.5`} strokeWidth={2.5} />
                        <span className="leading-relaxed opacity-90">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Package Button */}
                  <div className="mt-8 relative z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        showToastAndNavigate(pkg.id, pkg.name);
                      }}
                      className={`w-full py-4 text-[11px] uppercase tracking-widest font-bold rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl ${
                        pkg.name.toLowerCase().includes('gold') 
                          ? 'bg-gradient-to-r from-[#D19A3B] to-[#C99B4C] hover:from-[#B88730] hover:to-[#B5893F]' 
                          : pkg.name.toLowerCase().includes('silver')
                            ? 'bg-gradient-to-r from-[#8899A6] to-[#748796] hover:from-[#748796] hover:to-[#607482]'
                            : 'bg-gradient-to-r from-[#4A6478] to-[#5C7C8A] hover:from-[#3D5569] hover:to-[#4A6478]'
                      }`}
                    >
                      Select Package <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
