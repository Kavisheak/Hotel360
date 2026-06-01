import React from 'react';

const rows = [
  { date: 'Oct 14, 2024', ref: 'INV-9901-CS', category: 'Venue Rental',     amount: '$12,000.00', status: 'Fully Paid',      statusColor: 'text-green-600 font-bold' },
  { date: 'Oct 12, 2024', ref: 'INV-9884-DP', category: 'Catering Deposit', amount: '$3,500.00',  status: 'Deposit Paid',    statusColor: 'text-[#B08D2C] font-bold' },
  { date: 'Oct 10, 2024', ref: 'INV-9852-EX', category: 'Decor Services',   amount: '$2,100.00',  status: 'Pending',         statusColor: 'text-gray-500 font-semibold' },
];

const TransactionLedger = () => (
  <div className="bg-white border border-[#E0D8C3] rounded-xl overflow-hidden shadow-sm">
    <h3 className="text-sm font-serif font-semibold text-gray-800 px-5 py-4 border-b border-[#E0D8C3] bg-[#FDF9F1]">
      Transaction Ledger
    </h3>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left border-collapse">
        <thead className="bg-[#7C6A2E] text-white">
          <tr>
            {['Date', 'Reference', 'Category', 'Amount', 'Status'].map(h => (
              <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-b border-[#F2EADA] hover:bg-[#FDF9F1] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF5]'}`}>
              <td className="px-4 py-3 text-xs text-gray-600">{r.date}</td>
              <td className="px-4 py-3 text-xs font-mono text-gray-700 font-semibold">{r.ref}</td>
              <td className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">{r.category}</td>
              <td className="px-4 py-3 text-sm font-serif font-bold text-[#B08D2C]">{r.amount}</td>
              <td className="px-4 py-3">
                <span className={`text-[10px] uppercase tracking-widest ${r.statusColor}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* View full ledger */}
    <div className="px-5 py-3 text-center border-t border-[#F2EADA]">
      <button className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] hover:underline transition-all">
        View Full Ledger
      </button>
    </div>
  </div>
);

export default TransactionLedger;
