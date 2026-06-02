import React from 'react';

const bars = [
  { label: 'Fully Paid',       pct: 72, color: 'bg-green-500' },
  { label: 'Deposit Paid',     pct: 18, color: 'bg-[#B08D2C]' },
  { label: 'Unpaid / Overdue', pct: 10, color: 'bg-red-400' },
];

const PaymentStatus = () => (
  <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
    <h3 className="text-sm font-serif font-semibold text-gray-800 mb-5">Payment Status</h3>

    <div className="space-y-4 mb-5">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{b.label}</span>
            <span className="text-[10px] font-bold text-gray-600">{b.pct}%</span>
          </div>
          <div className="w-full bg-[#F2EADA] rounded-full h-2">
            <div
              className={`${b.color} h-2 rounded-full transition-all duration-700`}
              style={{ width: `${b.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Quote */}
    <div className="border-l-4 border-[#B08D2C] pl-3">
      <p className="text-xs italic text-gray-500 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        "Maintaining a 90% collection rate is the benchmark for Elite status."
      </p>
    </div>
  </div>
);

export default PaymentStatus;
