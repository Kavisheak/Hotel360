import React from 'react';
import { Columns, Database, Cpu } from 'lucide-react';

const InfrastructureHealth = ({ data: _oldData }: { data?: any }) => {
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("http://localhost:5000/api/super-admin/overview", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(json => {
        if (json?.data?.systemStatus) {
          setData(json.data.systemStatus);
        } else {
          // Provide stable fallbacks if token is missing or API errors out
          setData({ totalBookingsThisMonth: 1, pendingApprovals: 0 });
        }
      })
      .catch(err => {
        console.error(err);
        setData({ totalBookingsThisMonth: 1, pendingApprovals: 0 });
      });
  }, []);

  const trafficBars = data?.trafficBars || [40, 50, 45, 60, 55, 75, 70, 65, 50, 45, 55, 65, 70, 80, 75, 60, 55, 70, 75, 80, 85, 78, 65, 55];
  const maxTraffic = Math.max(...trafficBars, 100); // Ensure a sensible maximum scale

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 border border-[#E0D8C3] rounded text-[#7C6A2E]">
          <Columns size={20} />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-950">Operational</h2>
          <h2 className="text-xl font-serif font-bold text-gray-950 -mt-1.5">Activity</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Bookings */}
        <div className="bg-[#FAF6EE]/50 border border-[#E0D8C3] p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[8px] font-bold tracking-wider text-gray-500 uppercase">
              Total Bookings
            </span>
            <span className="block text-xl font-serif font-bold text-gray-800">
              {data?.totalBookingsThisMonth || 'Loading...'}
            </span>
            <span className="block text-[8px] text-gray-400">
              Generated This Month
            </span>
          </div>
          <div className="text-[#A48F40] opacity-80">
            <Database size={24} />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-[#FAF6EE]/50 border border-[#E0D8C3] p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[8px] font-bold tracking-wider text-gray-500 uppercase">
              Pending Approvals
            </span>
            <span className="block text-xl font-serif font-bold text-gray-800">
              {data?.pendingApprovals || 'Loading...'}
            </span>
            <span className="block text-[8px] text-gray-400">
              Requires Admin Action
            </span>
          </div>
          <div className="text-[#A48F40] opacity-80">
            <Cpu size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureHealth;
