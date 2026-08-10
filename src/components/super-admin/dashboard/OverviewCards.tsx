import React from 'react';
import { TrendingUp } from 'lucide-react';

const RevenueCard = ({ totalRevenue, thisMonthRevenue, revenueGrowth }: { totalRevenue: number; thisMonthRevenue: number; revenueGrowth: number }) => {
  // Let's assume a realistic monthly goal of LKR 50,000,000
  const monthlyGoal = 50000000;
  const progressPercentage = Math.min((thisMonthRevenue / monthlyGoal) * 100, 100);

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4 flex justify-between">
          <span>Total Revenue (All Time)</span>
          <span className="text-[#B08D2C]">{progressPercentage.toFixed(1)}% of Monthly Target</span>
        </p>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#3D3000] mb-4">
          LKR {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        </h2>
        <div className={`flex items-center gap-2 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          <TrendingUp size={16} className={revenueGrowth < 0 ? "rotate-180" : ""} />
          <span className="text-sm font-bold">{revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}% vs last month</span>
        </div>
      </div>
      {/* Dynamic sparkline bar */}
      <div className="mt-6 h-2 bg-[#F2EADA] rounded-full overflow-hidden" title={`LKR ${thisMonthRevenue.toLocaleString()} / ${monthlyGoal.toLocaleString()}`}>
        <div
          className="h-full bg-gradient-to-r from-[#B08D2C] to-[#E9C340] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

const BookingChart = ({ bookingTraffic, bookingTrafficMonthly }: { bookingTraffic: any[], bookingTrafficMonthly: any[] }) => {
  const [view, setView] = React.useState<'weekly' | 'monthly'>('weekly');
  const data = view === 'weekly' ? (bookingTraffic || []) : (bookingTrafficMonthly || []);
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Booking Traffic Frequency
        </p>
        <div className="flex gap-3">
          {(['weekly', 'monthly'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${view === v
                ? 'text-[#7C6A2E] border-b border-[#7C6A2E]'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end gap-2 sm:gap-3 flex-1 min-h-[120px]">
        {data.map((item, i) => {
          const heightPct = maxVal > 0 ? (item.count / maxVal) * 100 : 0;
          const isMax = item.count === maxVal && maxVal > 0;
          return (
            <div key={i} className="flex flex-col items-center flex-1 gap-1">
              <span className={`text-[9px] font-bold ${isMax ? 'text-[#7C6A2E]' : 'text-transparent'}`}>
                {item.count}
              </span>
              <div className="w-full relative" style={{ height: '100px' }}>
                <div
                  className={`absolute bottom-0 w-full rounded-sm transition-all duration-500 ${isMax ? 'bg-[#B08D2C]' : 'bg-[#EBE5D9]'
                    }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[9px] font-semibold text-gray-400">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OverviewCards = ({
  totalRevenue,
  thisMonthRevenue,
  revenueGrowth,
  bookingTraffic,
  bookingTrafficMonthly,
  systemStatus,
  sentimentAnalytics
}: {
  totalRevenue: number;
  thisMonthRevenue: number;
  revenueGrowth: number;
  bookingTraffic: any[];
  bookingTrafficMonthly: any[];
  systemStatus: any;
  sentimentAnalytics: any;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Revenue (Original design kept small) */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between rounded-lg">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-4">Total Revenue</p>
          <h2 className="text-3xl font-serif font-bold text-[#3D3000] mb-2">
            LKR {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </h2>
          <div className={`flex items-center gap-1.5 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            <TrendingUp size={14} className={revenueGrowth < 0 ? "rotate-180" : ""} />
            <span className="text-xs font-bold">{revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}% vs last month</span>
          </div>
        </div>
      </div>

      {/* 2. Confirmed Bookings */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between rounded-lg">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-4">Confirmed Bookings</p>
          <h2 className="text-3xl font-serif font-bold text-[#3D3000] mb-2">
            {systemStatus?.totalBookingsThisMonth || '0'}
          </h2>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">This Month</span>
          </div>
        </div>
      </div>

      {/* 3. Customer Satisfaction */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between rounded-lg">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-4">Customer Satisfaction</p>
          <h2 className="text-3xl font-serif font-bold text-green-700 mb-2">
            {systemStatus?.averageCustomerSatisfaction || 'N/A'}
          </h2>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              Based on {sentimentAnalytics?.distribution?.total || 0} reviews
            </span>
          </div>
        </div>
      </div>

      {/* 4. Negative Review Alerts */}
      <div className="bg-red-50 border border-red-200 p-6 shadow-sm flex flex-col justify-between rounded-lg">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-red-600 uppercase mb-4">Negative Review Alerts</p>
          <h2 className="text-3xl font-serif font-bold text-red-800 mb-2">
            {sentimentAnalytics?.negativeAlerts?.length || 0}
          </h2>
          <div className="flex items-center gap-1.5 text-red-600">
            <span className="text-xs font-bold uppercase tracking-wider">Require manager attention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
