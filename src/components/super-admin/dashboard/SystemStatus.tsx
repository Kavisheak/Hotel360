import React from 'react';

const SystemStatus = ({ status }: { status: any }) => {
  const statusItems = [
    { label: 'Total Bookings This Month', detail: status?.totalBookingsThisMonth || 'Loading...', color: 'bg-green-500' },
    { label: 'Pending Approvals', detail: status?.pendingApprovals || 'Loading...', color: 'bg-yellow-500' },
    { label: 'Upcoming Events (7 Days)', detail: status?.upcomingEvents7Days || 'Loading...', color: 'bg-blue-500' },
    { label: 'Average Satisfaction', detail: status?.averageCustomerSatisfaction || 'Loading...', color: 'bg-purple-500' },
  ];

  return (
    <div className="border border-[#E0D8C3] bg-[#FAF8F2] px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap gap-6 sm:gap-10">
        {statusItems.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} />
            <div>
              <p className="text-[10px] font-bold text-gray-600 tracking-wide uppercase">{s.label}</p>
              <p className="text-[9px] font-semibold text-gray-400 tracking-wider uppercase">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="border border-[#B08D2C] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase px-5 py-2.5 hover:bg-[#F9DD76] transition-colors shrink-0">
        GENERATE ANALYTICS REPORT
      </button>
    </div>
  );
};

export default SystemStatus;
