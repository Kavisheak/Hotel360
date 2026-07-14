"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { paymentAPI } from '../../../lib/api';

const formatCurrency = (val: number) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return `${val}`;
};

const GrowthTrend = () => {
  const [pointsData, setPointsData] = useState<any[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrend = async () => {
      const res = await paymentAPI.getAllPayments();
      if (res.ok) {
        const payments = res.data.data;
        const monthly = new Array(6).fill(0); 

        const now = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        for (let i = 0; i < 6; i++) {
          const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
          const m = d.getMonth();
          const y = d.getFullYear();
          
          monthly[i] = {
            val: payments.filter((p: any) => {
              if (p.paymentStatus !== "Paid") return false;
              const pd = new Date(p.createdAt || p.updatedAt || new Date());
              return pd.getMonth() === m && pd.getFullYear() === y;
            }).reduce((sum: number, p: any) => sum + p.amount, 0),
            label: monthNames[m]
          };
        }

        const max = Math.max(...monthly.map(m => m.val), 100000); 
        const newPoints = monthly.map((m, i) => {
          const x = i * 40;
          const y = 90 - ((m.val / max) * 80); // range from y=90 (bottom) to y=10 (top)
          return { x, y, val: m.val, label: m.label };
        });

        setPointsData(newPoints);
      }
    };
    fetchTrend();
  }, []);

  const polylineStr = pointsData.map(pt => `${pt.x},${pt.y}`).join(' ');
  const polygonStr = pointsData.length > 0 ? `0,110 ${polylineStr} 200,110` : '';

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E0D8C3] rounded-xl shadow-sm">
        <div className="px-5 pt-5 pb-3">
          <h3 className="font-serif font-semibold text-gray-800 text-sm">Growth Trend</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">Last 6 Months Revenue</p>
        </div>
        <div className="relative h-40 mx-5 mb-5 rounded-lg bg-[#FDF9F1] border border-[#E0D8C3] group">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <TrendingUp size={64} className="text-[#E0D8C3] opacity-50" />
          </div>
          
          {/* Chart SVG */}
          {pointsData.length > 0 && (
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 -10 200 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#B08D2C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#B08D2C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points={polygonStr}
                fill="url(#trendGrad)"
                className="transition-all duration-1000 ease-in-out"
              />
              <polyline
                points={polylineStr}
                fill="none"
                stroke="#B08D2C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
          )}

          {/* Interactive HTML Hover Zones & Tooltips */}
          {pointsData.length > 0 && pointsData.map((pt, i) => (
            <div 
              key={i}
              className="absolute h-full cursor-pointer z-10"
              style={{ left: `${(i / 5) * 100}%`, width: '20%', transform: 'translateX(-50%)' }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Visible Dot */}
              <div 
                className={`absolute w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 pointer-events-none
                ${hoveredPoint === i ? 'border-[#B08D2C] scale-150 shadow-md bg-white' : 'border-[#B08D2C] bg-[#FDF9F1]'}`}
                style={{ 
                  left: '50%',
                  top: `${((pt.y + 10) / 120) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Tooltip */}
              <div 
                className={`absolute top-0 left-1/2 -translate-x-1/2 mt-2 pointer-events-none transition-all duration-200 z-20
                ${hoveredPoint === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              >
                <div className="bg-[#7C6A2E] text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg whitespace-nowrap">
                  {pt.label} <span className="font-normal text-[#F9DD76] ml-1">LKR {formatCurrency(pt.val)}</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#7C6A2E] rotate-45" />
                </div>
              </div>
            </div>
          ))}
          
          {/* X Axis labels */}
          <div className="absolute bottom-1 w-full flex justify-between px-2 pointer-events-none z-0">
            {pointsData.map((pt, i) => (
              <span key={i} className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300
                ${hoveredPoint === i ? 'text-[#7C6A2E]' : 'text-gray-400'}`}>
                {pt.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthTrend;
