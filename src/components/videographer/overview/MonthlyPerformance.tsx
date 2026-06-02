import React from 'react';
import { TrendingUp } from 'lucide-react';

const performance = [
  { label: 'On-time arrival', value: 96, accent: 'bg-[#7C6A2E]' },
  { label: 'Media delivery', value: 88, accent: 'bg-[#5A87C7]' },
  { label: 'Client feedback', value: 98, accent: 'bg-[#B08D2C]' },
  { label: 'Coverage completeness', value: 91, accent: 'bg-[#4A463B]' },
];

const MonthlyPerformance = () => {
  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-3 mb-6">
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">MONTHLY PERFORMANCE</h3>
        <span className="flex items-center space-x-1 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase">
          <TrendingUp size={12} />
          <span>+8% VS LAST MONTH</span>
        </span>
      </div>

      <div className="space-y-4">
        {performance.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500">{item.value}%</span>
            </div>
            <div className="h-2 bg-[#FAF6EE] border border-[#E0D8C3] rounded-sm overflow-hidden">
              <div className={`h-full ${item.accent}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyPerformance;
