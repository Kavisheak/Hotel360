import React from 'react';

const bars = [
  { month: 'JAN', value: '40%', tone: 'light' },
  { month: 'FEB', value: '62%', tone: 'light' },
  { month: 'MAR', value: '78%', tone: 'dark' },
  { month: 'APR', value: '55%', tone: 'light' },
  { month: 'MAY', value: '85%', tone: 'dark' },
  { month: 'JUN', value: '96%', tone: 'dark' },
];

export default function MonthlyPerformance() {
  return (
    <article className="min-h-[560px] border border-[#E7DDCC] bg-[#F8F4EC] p-6 lg:p-8">
      <div className="mb-12 flex items-start justify-between gap-4">
        <h2 className="mb-2 text-[28px] font-serif text-gray-800">Monthly Projects</h2>
        <button className="mt-2 inline-flex items-center gap-3 text-[15px] font-serif text-gray-800">
          Annual View (2026)
          <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>

      <div className="flex h-[210px] items-end gap-5">
        {bars.map((bar) => (
          <div key={bar.month} className="flex flex-1 flex-col items-center gap-3">
            <div className="relative h-[185px] w-full bg-[#DDD6C8]">
              <div
                className={`absolute right-0 bottom-0 left-0 ${
                  bar.tone === 'dark' ? 'bg-[#6F5B00]' : 'bg-[#E6C340]'
                }`}
                style={{ height: bar.value }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[6px] bg-[#E7E1D4]" />
            </div>
            <span className="text-[34px] leading-none tracking-[0.08em] text-[#181818]">{bar.month}</span>
          </div>
        ))}
      </div>

      <div className="h-28" aria-hidden="true" />
    </article>
  );
}
