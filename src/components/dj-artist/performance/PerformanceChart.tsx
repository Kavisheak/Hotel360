import React from "react";

const bars = [
  { month: "JAN", height: "42%", tone: "light" },
  { month: "FEB", height: "50%", tone: "light" },
  { month: "MAR", height: "72%", tone: "dark" },
  { month: "APR", height: "46%", tone: "light" },
  { month: "MAY", height: "58%", tone: "light" },
  { month: "JUN", height: "78%", tone: "dark" },
];

export default function PerformanceChart() {
  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[28px] font-serif text-gray-800">Monthly Performance</h2>
        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Annual View [2024] <span className="inline-block rotate-90">›</span>
        </button>
      </div>

      <div className="flex h-[290px] items-end gap-3 px-2 pb-2">
        {bars.map((bar) => (
          <div key={bar.month} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
            <div className="flex w-full items-end justify-center gap-0.5">
              <div className="w-full max-w-[38px] bg-[#ECE2CF]" style={{ height: bar.height }}>
                <div className={`h-full w-full ${bar.tone === "dark" ? "bg-[#7C6A2E]" : "bg-[#F9DD76]"}`} />
              </div>
            </div>
            <span className="text-[12px] tracking-[0.18em] text-gray-700">{bar.month}</span>
          </div>
        ))}
      </div>
    </article>
  );
}