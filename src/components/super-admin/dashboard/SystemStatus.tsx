import React from 'react';

const SystemStatus = ({ status }: { status: any }) => {
  const statusItems = [
    { label: 'Total Bookings This Month', detail: status?.totalBookingsThisMonth ?? 'Loading...', color: 'bg-[#10B981]', growth: status?.bookingGrowth },
    { label: 'Pending Approvals', detail: status?.pendingApprovals ?? 'Loading...', color: 'bg-[#F59E0B]' },
    { label: 'Upcoming Events (7 Days)', detail: status?.upcomingEvents7Days ?? 'Loading...', color: 'bg-[#3B82F6]' },
    { label: 'Average Satisfaction', detail: status?.averageCustomerSatisfaction ?? 'Loading...', color: 'bg-[#8B5CF6]' },
  ];

  return (
    <div className="border border-[#E0D8C3] bg-white px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
      <div className="flex flex-wrap gap-8 sm:gap-12">
        {statusItems.map((s) => (
          <div key={s.label} className="flex items-start gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0 mt-1`} />
            <div className="flex flex-col">
              <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1">{s.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-[#1A1512]">{s.detail}</p>
                {s.growth !== undefined && (
                  <span className={`text-xs font-bold ${s.growth >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                    {s.growth >= 0 ? '+' : ''}{s.growth}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="border border-[#B08D2C] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase px-5 py-2.5 hover:bg-[#F9DD76] transition-colors shrink-0 rounded-sm">
        GENERATE ANALYTICS REPORT
      </button>
    </div>
  );
};

export default SystemStatus;
