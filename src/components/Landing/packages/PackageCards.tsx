import React from "react";
import { Check, Users } from "lucide-react";
import { SIGNATURE_PACKAGES } from "./types";

interface PackageCardsProps {
  activePackage: "silver" | "gold" | "diamond";
  setActivePackage: (id: "silver" | "gold" | "diamond") => void;
}

export default function PackageCards({ activePackage, setActivePackage }: PackageCardsProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {SIGNATURE_PACKAGES.map((pkg, index) => {
          const isActive = activePackage === pkg.id;
          
          return (
            <div 
              key={pkg.id}
              onClick={() => setActivePackage(pkg.id)}
              className={`
                relative bg-white border p-6 lg:p-8 cursor-pointer transition-all duration-300 card-entrance hover-lift hover-glow stagger-${index + 1}
                ${isActive 
                  ? "border-[#C9A84C] shadow-2xl scale-[1.02] -translate-y-2" 
                  : "border-[#D4C9A8] shadow-md hover:shadow-xl hover:border-[#C9A84C]/50"
                }
              `}
            >
              {pkg.isMostLoved && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#C9A84C] text-[#2C1E14] text-[9px] uppercase tracking-widest px-3 py-1 font-bold shadow-sm">
                  Most Chosen
                </div>
              )}

              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-serif text-gray-900">{pkg.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-serif text-[#C9A84C] leading-none">{pkg.price}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <Users className="w-4 h-4 text-[#A67C52]" /> {pkg.guests} Guests
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-light min-h-[40px]">
                  {pkg.description}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-gray-600">
                    <Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`
                  w-full py-3 text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 btn-interactive
                  ${isActive 
                    ? "bg-[#C9A84C] text-[#2C1E14] shadow-[0_0_15px_rgba(201,168,76,0.3)]" 
                    : "border border-[#2C1E14] text-[#2C1E14] hover:bg-[#2C1E14] hover:text-[#C9A84C]"
                  }
                `}
              >
                Select {pkg.name.split(' ')[0]}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
