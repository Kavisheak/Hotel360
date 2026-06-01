import React from 'react';
import { Banknote, Receipt, Star, PieChart } from 'lucide-react';

const metrics = [
  {
    title: 'Total Revenue',
    icon: <Banknote size={16} className="text-[#B08D2C]" />,
    value: '$1,284,500',
    trend: '+12.4% vs last year',
    trendColor: 'text-green-600',
  },
  {
    title: 'Avg Booking Value',
    icon: <Receipt size={16} className="text-gray-500" />,
    value: '$24,320',
    trend: 'Stable performance',
    trendColor: 'text-gray-500',
  },
  {
    title: 'Customer NPS',
    icon: <Star size={16} className="text-[#B08D2C]" />,
    value: '8.9/10',
    trend: 'Top 5% Industry',
    trendColor: 'text-green-600',
  },
  {
    title: 'Hall Utilization',
    icon: <PieChart size={16} className="text-[#7C6A2E]" />,
    value: '78.4%',
    trend: 'Peak season active',
    trendColor: 'text-gray-800',
  },
];

const ReportMetrics = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {metrics.map((m) => (
      <div key={m.title} className="bg-white border border-[#E0D8C3] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{m.title}</h3>
          {m.icon}
        </div>
        <p className="text-2xl lg:text-3xl font-serif font-semibold text-gray-800 mb-1">{m.value}</p>
        <p className={`text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 ${m.trendColor}`}>
          {m.trend.includes('+') && <span className="text-[10px]">↗</span>}
          {m.trend}
        </p>
      </div>
    ))}
  </div>
);

export default ReportMetrics;
