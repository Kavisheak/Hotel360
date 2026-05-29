import React from "react";
import Image from "next/image";
import { Users, Check, ArrowRight } from "lucide-react";
import { SIGNATURE_PACKAGES } from "./types";

interface PackageCardsProps {
  onSelectPackage: (id: "silver" | "gold" | "diamond") => void;
}

export default function PackageCards({ onSelectPackage }: PackageCardsProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-16 space-y-3">
        <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-semibold">
          Signature Curation
        </p>
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
          Bespoke Celebration Offerings
        </h2>
        <div className="w-12 h-[1px] bg-[#c69c6d] mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {SIGNATURE_PACKAGES.map((pkg) => (
          <div 
            key={pkg.id}
            className={`flex flex-col bg-white border border-[#E8DFC9] shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-sm overflow-hidden relative group ${
              pkg.isMostLoved ? "ring-1 ring-[#c69c6d]" : ""
            }`}
          >
            {/* Image Section */}
            <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
              <Image
                src={pkg.image}
                alt={pkg.name}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {pkg.isMostLoved && (
                <span className="absolute top-4 right-4 bg-[#c69c6d] text-white text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1 border border-white/20 shadow-md">
                  Most Loved
                </span>
              )}

              <div className="absolute bottom-4 left-6">
                <p className="text-[#c69c6d] text-[9px] tracking-[0.2em] uppercase font-bold mb-1">Base capacity</p>
                <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                  <Users className="w-3.5 h-3.5" />
                  <span>{pkg.guests}</span>
                </div>
              </div>
            </div>

            {/* Package Content */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif text-[#1A1512] leading-tight mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#7C6A2E]">{pkg.price}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Starting price</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {pkg.description}
                </p>

                <div className="border-t border-[#FAF6EE] pt-6 space-y-3.5">
                  <p className="text-[9px] uppercase tracking-widest text-[#A6955C] font-bold">What is Included:</p>
                  <ul className="space-y-3 text-xs">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-600 font-light leading-snug">
                        <Check className="w-4 h-4 text-[#c69c6d] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => onSelectPackage(pkg.id)}
                  className="w-full text-center border border-[#1A1512] text-[#1A1512] py-3 hover:bg-[#1A1512] hover:text-white transition-all duration-300 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2"
                >
                  Select & Calculate Cost
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
