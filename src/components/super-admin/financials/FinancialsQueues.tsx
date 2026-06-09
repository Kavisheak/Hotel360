import React from 'react';
import { refundQueueData, revenueCategoryData } from './financeData';
import { ArrowLeftSquare } from 'lucide-react';

const FinancialsQueues = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Refund Management Queue */}
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-6 shadow-sm">
        <h3 className="text-xl font-serif text-gray-800 mb-6">Refund Management Queue</h3>
        <div className="space-y-4">
          {refundQueueData.map((req) => (
            <div key={req.id} className="bg-[#FAF6EE] border border-[#E0D8C3] p-4 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="bg-[#F6EBEA] p-2 rounded text-red-500">
                  <ArrowLeftSquare size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{req.id} - {req.clientName}</p>
                  <p className="text-[10px] text-gray-500">{req.requestedTime} · €{req.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <button className="border border-red-500 text-red-500 font-bold text-[9px] tracking-widest uppercase px-4 py-1.5 hover:bg-red-50 transition-colors">
                Approve
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Service Category */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
        <h3 className="text-xl font-serif text-gray-800 mb-6 border-b border-[#E0D8C3] pb-4">Revenue by Service Category</h3>
        <div className="flex items-center justify-center gap-12 mt-8">
          {/* Mock Donut Chart */}
          <div className="relative w-40 h-40 rounded-full border-[16px] border-[#7C6A2E] flex items-center justify-center shadow-inner" style={{ borderRightColor: '#F1D570', borderBottomColor: '#82A0F6' }}>
            <div className="text-center bg-white w-full h-full rounded-full flex flex-col items-center justify-center">
              <p className="text-[8px] font-bold tracking-widest text-gray-500 uppercase">Venue Hire</p>
              <p className="text-3xl font-serif font-bold text-gray-800">65%</p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {revenueCategoryData.map((cat) => (
              <div key={cat.label} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: cat.color }}></div>
                <span className="text-[10px] font-bold tracking-widest text-gray-800 uppercase">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsQueues;
