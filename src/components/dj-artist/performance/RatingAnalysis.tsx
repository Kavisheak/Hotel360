import React from "react";

const ratings = [
  { label: "5 STAR", value: 88 },
  { label: "4 STAR", value: 68 },
  { label: "3 STAR", value: 30 },
  { label: "2 STAR", value: 12 },
  { label: "1 STAR", value: 4 },
];

export default function RatingAnalysis() {
  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <h2 className="text-[28px] font-serif text-gray-800">Rating Analysis</h2>

      <div className="mt-6 space-y-5">
        {ratings.map((rating) => (
          <div key={rating.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                {rating.label}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                {rating.value}%
              </span>
            </div>

            <div className="h-2 bg-[#E9E0CF]">
              <div className="h-2 bg-[#7C6A2E]" style={{ width: `${rating.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}