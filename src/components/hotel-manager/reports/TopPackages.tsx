"use client";

import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../../../lib/api';

const TopPackages = () => {
  const [packages, setPackages] = useState<any[]>([
    { name: 'Loading...', bookings: '-', revenue: '-' }
  ]);

  useEffect(() => {
    const fetchTopPackages = async () => {
      const res = await bookingAPI.getAllBookings();
      if (res.ok) {
        const bookings = res.data.data;
        const packageCounts: Record<string, { count: number, totalCost: number }> = {};

        bookings.forEach((b: any) => {
          if (b.status !== "Cancelled" && b.status !== "Rejected") {
            const name = b.packageName || "Custom Package";
            if (!packageCounts[name]) {
              packageCounts[name] = { count: 0, totalCost: 0 };
            }
            packageCounts[name].count++;
            packageCounts[name].totalCost += (b.totalCost || 0);
          }
        });

        const formatCurrency = (val: number) => {
          if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
          if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
          if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
          return `${val}`;
        };

        const sortedPackages = Object.keys(packageCounts)
          .map(name => ({
            name,
            bookings: packageCounts[name].count,
            revenue: formatCurrency(packageCounts[name].totalCost),
          }))
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 4);

        setPackages(sortedPackages.length > 0 ? sortedPackages : [
            { name: 'No Bookings', bookings: 0, revenue: '-' }
        ]);
      }
    };
    fetchTopPackages();
  }, []);

  return (
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
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-right">Revenue Generated</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((p, i) => (
            <tr key={i} className="border-b border-[#F2EADA] hover:bg-[#FDF9F1] transition-colors last:border-b-0">
              <td className="px-5 py-4 text-xs font-semibold text-gray-800 font-serif leading-tight pr-0">
                {p.name.split(' ').map((word: string, idx: number) => (
                  <React.Fragment key={idx}>
                    {word}<br/>
                  </React.Fragment>
                ))}
              </td>
              <td className="px-5 py-4 text-xs text-gray-600 text-center">{p.bookings}</td>
              <td className="px-5 py-4 text-xs font-bold text-right text-green-600">{p.revenue !== '-' ? `LKR ${p.revenue}` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default TopPackages;
