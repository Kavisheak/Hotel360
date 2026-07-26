import React from 'react';
import { ArrowLeftSquare } from 'lucide-react';

const FinancialsQueues = ({ refundQueue = [], revenueCategory = [], onApproveRefund }: { refundQueue: any[]; revenueCategory: any[], onApproveRefund?: (id: string) => void }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Refund Management Queue */}
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-6 shadow-sm">
        <h3 className="text-xl font-serif text-gray-800 mb-6">Refund Management Queue</h3>
        <div className="space-y-4">
          {refundQueue.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No refund requests pending.</p>
          ) : (
            refundQueue.map((req) => (
              <div key={req.id} className="bg-[#FAF6EE] border border-[#E0D8C3] p-4 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="bg-[#F6EBEA] p-2 rounded text-red-500">
                  <ArrowLeftSquare size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{req.displayId} - {req.clientName}</p>
                  <p className="text-[10px] text-gray-500">{req.requestedTime} · LKR {req.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <button 
                onClick={() => onApproveRefund && onApproveRefund(req.id)}
                className="border border-red-500 text-red-500 font-bold text-[9px] tracking-widest uppercase px-4 py-1.5 hover:bg-red-50 transition-colors"
              >
                Approve
              </button>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Revenue by Service Category */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
        <h3 className="text-xl font-serif text-gray-800 mb-6 border-b border-[#E0D8C3] pb-4">Revenue by Service Category</h3>
        <div className="flex items-center justify-center gap-12 mt-8">
          {/* Mock Donut Chart */}
          <div className="relative w-40 h-40 rounded-full border-[16px] border-[#E0D8C3] flex items-center justify-center shadow-inner" 
               style={{ 
                 borderTopColor: revenueCategory[0]?.color || '#E0D8C3', 
                 borderRightColor: revenueCategory[1]?.color || '#E0D8C3',
                 borderBottomColor: revenueCategory[2]?.color || '#E0D8C3',
                 borderLeftColor: revenueCategory[3]?.color || '#E0D8C3'
               }}>
            <div className="text-center bg-white w-full h-full rounded-full flex flex-col items-center justify-center">
              <p className="text-[8px] font-bold tracking-widest text-gray-500 uppercase">{revenueCategory[0]?.label || 'NO DATA'}</p>
              <p className="text-3xl font-serif font-bold text-gray-800">{revenueCategory[0]?.percentage || 0}%</p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {revenueCategory.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No category data yet.</p>
            ) : (
              revenueCategory.map((cat) => (
              <div key={cat.label} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: cat.color }}></div>
                <span className="text-[10px] font-bold tracking-widest text-gray-800 uppercase">{cat.label}</span>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsQueues;
