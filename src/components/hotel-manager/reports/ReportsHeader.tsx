import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const ReportsHeader = () => (
  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
    <div>
      <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-800">
        Performance Reports
      </h2>
      <p className="text-sm italic text-[#A6955C] mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Comprehensive analytics for the period of 2024 fiscal year
      </p>
    </div>
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Date picker mock */}
      <button className="w-full sm:w-auto flex items-center justify-between gap-4 bg-white border border-[#E0D8C3] px-4 py-2.5 rounded text-gray-700 hover:bg-[#FDF9F1] transition-colors">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#B08D2C]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Oct 1, 2023 - Mar 31, 2024</span>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      
      {/* Generate Report Button */}
      <button className="w-full sm:w-auto bg-[#7C6A2E] hover:bg-[#635525] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded transition-colors whitespace-nowrap">
        Generate New Report
      </button>
    </div>
  </div>
);

export default ReportsHeader;
