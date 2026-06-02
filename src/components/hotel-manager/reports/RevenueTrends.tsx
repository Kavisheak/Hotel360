import React from 'react';
import { Download, LayoutGrid } from 'lucide-react';

const data = [
  { month: 'Oct', value: 40 },
  { month: 'Nov', value: 55 },
  { month: 'Dec', value: 85 },
  { month: 'Jan', value: 30 },
  { month: 'Feb', value: 50 },
  { month: 'Mar', value: 65 },
];

const RevenueTrends = () => (
  <div className="bg-white border border-[#E0D8C3] p-5 shadow-sm h-full flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-serif font-semibold text-gray-800">Revenue Trends</h3>
      <div className="flex items-center gap-3 text-gray-400">
        <button className="hover:text-[#B08D2C] transition-colors"><LayoutGrid size={16} /></button>
        <button className="hover:text-[#B08D2C] transition-colors"><Download size={16} /></button>
      </div>
    </div>
    
    <div className="flex-1 flex items-end justify-between gap-2 lg:gap-4 mt-auto">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center flex-1 h-40 lg:h-48 relative">
          <div className="absolute inset-0 bg-[#E0D8C3] opacity-30" />
          <div 
            className="w-full bg-[#B08D2C] hover:bg-[#9B7A20] transition-colors cursor-pointer absolute bottom-0" 
            style={{ height: `${d.value}%` }}
            title={`${d.value}%`}
          />
        </div>
      ))}
    </div>
    
    <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#E0D8C3]">
      {data.map((d) => (
        <span key={d.month} className="text-[10px] text-gray-500 w-full text-center">
          {d.month}
        </span>
      ))}
    </div>
  </div>
);

export default RevenueTrends;
