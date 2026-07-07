import React from "react";
import { Check, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { SIGNATURE_PACKAGES } from "./types";

interface PackageCardsProps {
  activePackage: string;
  setActivePackage: (id: any) => void;
  packages?: any[];
}

export default function PackageCards({ activePackage, setActivePackage, packages }: PackageCardsProps) {
  const router = useRouter();
  const displayPackages = packages && packages.length > 0 ? packages : SIGNATURE_PACKAGES;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20 bg-white dark:bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {displayPackages.map((pkg, index) => {
          const isActive = activePackage === pkg.id;
          const displayGuests = pkg.guests.toLowerCase().includes("guest") ? pkg.guests : `${pkg.guests} Guests`;
          
          return (
            <div 
              key={pkg.id}
              onClick={() => setActivePackage(pkg.id as any)}
              className={`
                relative bg-white dark:bg-[#111111] p-6 lg:p-8 cursor-pointer transition-all duration-500 card-entrance hover-glow stagger-${index + 1}
                ${isActive 
                  ? "border-2 border-[#D4AF37] dark:border-[#C9A84C] shadow-[0_0_30px_rgba(212,175,55,0.1)] dark:shadow-[0_0_30px_rgba(201,168,76,0.15)] scale-[1.02] -translate-y-2 z-20" 
                  : "border border-[#D4C9A8]/50 dark:border-[#C9A84C]/50 hover:border-[#D4AF37]/60 dark:hover:border-[#C9A84C] z-10"
                }
              `}
            >
              {pkg.isMostLoved && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#0A0A0A] text-[9px] uppercase tracking-widest px-3 py-1 font-bold shadow-sm">
                  Most Chosen
                </div>
              )}

              <div className="space-y-4 mb-8 text-center">
                <h3 className="text-2xl font-serif text-[#805D3A] dark:text-[#C9A84C]">{pkg.name}</h3>
                <div className="flex justify-center items-end gap-1">
                  <span className="text-4xl font-serif text-[#2C1E14] dark:text-white leading-none">{pkg.price}</span>
                </div>
                <div className="flex justify-center items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">
                  <Users className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C]" /> {displayGuests}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light min-h-[40px]">
                  {pkg.description}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {pkg.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-gray-700 dark:text-gray-300 font-light">
                    <Check className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/book?package=${pkg.id}`);
                }}
                className={`
                  w-full py-3.5 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 btn-interactive flex justify-center items-center gap-2
                  ${isActive 
                    ? "bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#0A0A0A] hover:bg-[#C9A84C] dark:hover:bg-[#B5953F]" 
                    : "border border-[#D4AF37]/50 dark:border-[#C9A84C] bg-white dark:bg-transparent text-[#805D3A] dark:text-[#C9A84C] hover:bg-gray-50 dark:hover:bg-[#C9A84C]/10"
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
