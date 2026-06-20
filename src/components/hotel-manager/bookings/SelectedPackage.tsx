import React from 'react';
import { Check } from 'lucide-react';

const features = [
  '12-Hour Venue Exclusive',
  '5-Course Michelin-Inspired Menu',
  'Premium Open Bar (Top-Shelf)',
];

const SelectedPackage = ({ booking }: { booking: any }) => (
  <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm h-full">
    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4">
      Selected Package
    </h4>

    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="text-xl font-serif font-semibold text-gray-800">{booking.package}</p>
        <p className="text-sm italic text-gray-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          LKR {booking.totalCost?.toLocaleString() || 'N/A'} Total
        </p>
      </div>
      <span className="bg-[#F9DD76] text-[#7C6A2E] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-[#E0D8C3] whitespace-nowrap">
        {booking.status === "DepositPaid" ? "DEPOSIT PAID" : booking.status === "BalancePaid" ? "FULLY PAID" : "PENDING CASH"}
      </span>
    </div>

    <div className="mt-4 space-y-2">
      {features.map((f) => (
        <div key={f} className="flex items-center gap-2">
          <Check size={13} className="text-[#B08D2C] shrink-0" />
          <span className="text-sm text-gray-700">{f}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SelectedPackage;
