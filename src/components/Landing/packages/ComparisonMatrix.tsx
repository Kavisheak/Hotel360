import React from "react";
import { Check, Minus } from "lucide-react";
import { MATRIX_DATA } from "./types";

export default function ComparisonMatrix() {
  return (
    <section className="bg-[#0A0A0A] py-16 md:py-24 px-6 border-t border-[#C9A84C]/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold section-reveal">
            Detailed Analysis
          </p>
          <h2 className="text-3xl font-serif text-white leading-tight section-reveal stagger-1">
            Compare Frameworks
          </h2>
          <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto mt-4 section-reveal stagger-2"></div>
        </div>

        <div className="overflow-x-auto section-reveal stagger-3">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-[#111111] border-b border-[#C9A84C]/30 text-xs uppercase tracking-widest text-gray-400 font-bold w-[40%]">
                  Feature / Service
                </th>
                <th className="py-4 px-6 bg-[#0A0A0A] border-b border-[#C9A84C]/30 text-xs uppercase tracking-widest text-white font-bold text-center w-[20%]">
                  Silver
                </th>
                <th className="py-4 px-6 bg-[#C9A84C]/10 border-b border-[#C9A84C] text-xs uppercase tracking-widest text-[#C9A84C] font-extrabold text-center w-[20%] relative">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#C9A84C]"></div>
                  Gold
                </th>
                <th className="py-4 px-6 bg-[#111111] border-b border-[#C9A84C]/30 text-xs uppercase tracking-widest text-[#D4AF37] font-bold text-center w-[20%]">
                  Diamond
                </th>
              </tr>
            </thead>
            <tbody>
              {MATRIX_DATA.map((row, index) => (
                <tr key={index} className="hover:bg-[#111111]/80 transition-colors">
                  <td className="py-4 px-6 border-b border-white/10 text-xs text-gray-300 font-light">
                    {row.feature}
                  </td>
                  
                  {/* Silver */}
                  <td className="py-4 px-6 border-b border-white/10 text-center">
                    {typeof row.silver === 'boolean' ? (
                      row.silver ? <Check className="w-4 h-4 text-gray-500 mx-auto" /> : <Minus className="w-4 h-4 text-gray-700 mx-auto" />
                    ) : (
                      <span className="text-[11px] text-gray-400">{row.silver}</span>
                    )}
                  </td>

                  {/* Gold (Highlighted) */}
                  <td className="py-4 px-6 border-b border-[#C9A84C]/30 bg-[#C9A84C]/5 text-center">
                    {typeof row.gold === 'boolean' ? (
                      row.gold ? <Check className="w-5 h-5 text-[#C9A84C] mx-auto" /> : <Minus className="w-4 h-4 text-[#C9A84C]/20 mx-auto" />
                    ) : (
                      <span className="text-[11px] font-semibold text-[#C9A84C]">{row.gold}</span>
                    )}
                  </td>

                  {/* Diamond */}
                  <td className="py-4 px-6 border-b border-white/10 text-center bg-[#111111]/30">
                    {typeof row.diamond === 'boolean' ? (
                      row.diamond ? <Check className="w-5 h-5 text-[#D4AF37] mx-auto" /> : <Minus className="w-4 h-4 text-gray-700 mx-auto" />
                    ) : (
                      <span className="text-[11px] font-semibold text-[#D4AF37]">{row.diamond}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
