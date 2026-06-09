import React from 'react';
import { Banknote, TrendingUp, FileText } from 'lucide-react';

const FinancialsStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Revenue */}
      <div className="bg-white border border-[#E0D8C3] p-6 flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Total Revenue (YTD)</p>
          <Banknote className="text-[#7C6A2E]" size={18} />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#7C6A2E]">€482,900.00</h2>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-green-600" />
            <p className="text-[10px] font-bold text-green-600">+12.4% from last period</p>
          </div>
        </div>
      </div>

      {/* Monthly Target Progress */}
      <div className="bg-[#FAF6EE] border border-[#E0D8C3] p-6 flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Monthly Target Progress</p>
          <TrendingUp className="text-[#7C6A2E]" size={18} />
        </div>
        <div>
          <div className="w-full bg-[#E0D8C3] h-1.5 mb-4">
            <div className="bg-[#7C6A2E] h-1.5 w-[78%]"></div>
          </div>
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-serif text-gray-800">€62,400.00</h2>
            <p className="text-[10px] text-gray-500 font-medium">78% of Target</p>
          </div>
        </div>
      </div>

      {/* Outstanding Balances */}
      <div className="bg-white border border-[#E0D8C3] p-6 flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Outstanding Balances</p>
          <FileText className="text-[#7C6A2E]" size={18} />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">€18,250.00</h2>
          <p className="text-[10px] italic text-gray-500 mt-2">12 contracts awaiting final payment</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialsStats;
