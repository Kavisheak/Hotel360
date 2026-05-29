import React from "react";
import { MATRIX_DATA } from "./types";

export default function ComparisonMatrix() {
  return (
    <section className="bg-white border-t border-b border-[#E8DFC9] py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-semibold">
            Compare Specifications
          </p>
          <h2 className="text-3xl font-serif text-gray-900 leading-tight">
            Feature Comparison Matrix
          </h2>
          <div className="w-12 h-[1px] bg-[#c69c6d] mx-auto mt-4"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E8DFC9] text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">
                <th className="py-4 pr-4 font-semibold">Feature Specifications</th>
                <th className="py-4 px-4 font-semibold">Silver Framework</th>
                <th className="py-4 px-4 font-semibold bg-[#C69C6D]/5 text-black">Gold (Recommended)</th>
                <th className="py-4 pl-4 font-semibold">Diamond Framework</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6EE] text-gray-700">
              {MATRIX_DATA.map((row, i) => (
                <tr key={i} className="hover:bg-[#FAF6EE]/50 transition-colors">
                  <td className="py-4 pr-4 font-medium text-gray-900">
                    <p className="font-semibold text-xs text-[#1A1512]">{row.feature}</p>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-light">{row.category}</span>
                  </td>
                  <td className="py-4 px-4 font-light leading-relaxed">{row.silver}</td>
                  <td className="py-4 px-4 font-light leading-relaxed bg-[#C69C6D]/5">{row.gold}</td>
                  <td className="py-4 pl-4 font-light leading-relaxed">{row.diamond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
