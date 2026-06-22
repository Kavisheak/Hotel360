"use client";

import React, { useEffect, useState } from 'react';
import { Download, LayoutGrid } from 'lucide-react';
import { paymentAPI } from '../../../lib/api';

const RevenueTrends = () => {
  const [data, setData] = useState<{month: string, value: number, rawValue: number}[]>([]);

  useEffect(() => {
    const fetchTrends = async () => {
      const res = await paymentAPI.getAllPayments();
      if (res.ok) {
        const payments = res.data.data;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date();
        const currentMonthIndex = d.getMonth();
        
        let chartData = [];
        for (let i = 5; i >= 0; i--) {
          let mIndex = currentMonthIndex - i;
          let yearOffset = 0;
          if (mIndex < 0) {
            mIndex += 12;
            yearOffset = -1;
          }
          chartData.push({ month: months[mIndex], monthIndex: mIndex, year: d.getFullYear() + yearOffset, value: 0, rawValue: 0 });
        }

        payments.forEach((p: any) => {
          if (p.paymentStatus === "Paid") {
            const pDate = new Date(p.createdAt);
            const pMonth = pDate.getMonth();
            const pYear = pDate.getFullYear();
            
            const target = chartData.find(c => c.monthIndex === pMonth && c.year === pYear);
            if (target) {
              target.rawValue += p.amount;
            }
          }
        });

        const maxRaw = Math.max(...chartData.map(c => c.rawValue), 1); // prevent division by zero
        const finalData = chartData.map(c => ({
          ...c,
          value: c.rawValue > 0 ? Math.max(5, Math.round((c.rawValue / maxRaw) * 100)) : 0
        }));
        
        setData(finalData);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="bg-white border border-[#E0D8C3] p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif font-semibold text-gray-800">Revenue Trends</h3>
        <div className="flex items-center gap-3 text-gray-400">
          <button className="hover:text-[#B08D2C] transition-colors"><LayoutGrid size={16} /></button>
          <button className="hover:text-[#B08D2C] transition-colors"><Download size={16} /></button>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 lg:gap-4 mt-auto">
        {data.map((d) => (
          <div key={d.month} className="flex flex-col items-center flex-1 h-40 lg:h-48 relative group">
            <div className="absolute inset-0 bg-[#E0D8C3] opacity-30" />
            <div
              className="w-full bg-[#B08D2C] group-hover:bg-[#9B7A20] transition-all duration-700 cursor-pointer absolute bottom-0"
              style={{ height: `${d.value}%` }}
              title={`LKR ${d.rawValue.toLocaleString()}`}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#E0D8C3]">
        {data.map((d) => (
          <span key={d.month} className="text-[10px] text-gray-500 w-full text-center">
            {d.month}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RevenueTrends;
