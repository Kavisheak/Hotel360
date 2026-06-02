import React from 'react';

const packages = [
  { name: 'Royal Diamond Wedding', bookings: 48, margin: '32%', marginColor: 'text-green-600' },
  { name: 'Elite Corporate Gala', bookings: 32, margin: '28%', marginColor: 'text-green-600' },
  { name: 'Sapphire Evening', bookings: 24, margin: '24%', marginColor: 'text-green-600' },
  { name: 'Petite Social Brunch', bookings: 18, margin: '19%', marginColor: 'text-green-600' },
];

const TopPackages = () => (
  <div className="bg-white border border-[#E0D8C3] shadow-sm h-full">
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D8C3] bg-[#FDF9F1]">
      <h3 className="text-sm font-serif font-semibold text-gray-800">Top Performing Packages</h3>
      <button className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#7C6A2E]">
        Full Report
      </button>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#7C6A2E] text-white">
          <tr>
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest">Package Name</th>
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-center">Bookings</th>
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-right">Profit Margin</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((p, i) => (
            <tr key={i} className="border-b border-[#F2EADA] hover:bg-[#FDF9F1] transition-colors last:border-b-0">
              <td className="px-5 py-4 text-xs font-semibold text-gray-800 font-serif leading-tight pr-0">
                {p.name.split(' ').map((word, idx) => (
                  <React.Fragment key={idx}>
                    {word}<br/>
                  </React.Fragment>
                ))}
              </td>
              <td className="px-5 py-4 text-xs text-gray-600 text-center">{p.bookings}</td>
              <td className={`px-5 py-4 text-xs font-bold text-right ${p.marginColor}`}>{p.margin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TopPackages;
