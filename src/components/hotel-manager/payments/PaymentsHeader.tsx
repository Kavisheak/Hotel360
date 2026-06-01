import React from 'react';
import { Download } from 'lucide-react';

const PaymentsHeader = () => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-800">
        Finance Dashboard
      </h2>
      <p className="text-sm italic text-[#A6955C] mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Exquisite management of elite celebrations.
      </p>
    </div>
    <button className="flex items-center gap-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded transition-colors whitespace-nowrap self-start">
      <Download size={13} />
      Download Report
    </button>
  </div>
);

export default PaymentsHeader;
