import React from 'react';
import { Columns, Database, Cpu } from 'lucide-react';

const InfrastructureHealth = ({ data }: { data?: any }) => {
  // Use real data if available, fallback to dummy values while loading
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
          <h2 className="text-xl font-serif font-bold text-gray-950">Infrastructure</h2>
          <h2 className="text-xl font-serif font-bold text-gray-950 -mt-1.5">Health</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Database Engine */}
        <div className="bg-[#FAF6EE]/50 border border-[#E0D8C3] p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[8px] font-bold tracking-wider text-gray-500 uppercase">
              Database Engine
            </span>
            <span className="block text-xl font-serif font-bold text-gray-800">
              {data?.uptimePercentage || 99.98}%
            </span>
            <span className="block text-[8px] text-gray-400">
              Uptime (Last 30 Days)
            </span>
          </div>
          <div className="text-[#A48F40] opacity-80">
            <Database size={24} />
          </div>
        </div>

        {/* API Gateway */}
        <div className="bg-[#FAF6EE]/50 border border-[#E0D8C3] p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[8px] font-bold tracking-wider text-gray-500 uppercase">
              API Gateway
            </span>
            <span className="block text-xl font-serif font-bold text-gray-800">
              {data?.avgLatency || 42}ms
            </span>
            <span className="block text-[8px] text-gray-400">
              Average Latency
            </span>
          </div>
          <div className="text-[#A48F40] opacity-80">
            <Cpu size={24} />
          </div>
        </div>
      </div>

      {/* Traffic Bar Chart */}
      <div className="space-y-3">
        <div className="h-16 flex items-end gap-[3px] bg-[#FAF6EE]/30 p-2 border border-[#E0D8C3]/50">
          {trafficBars.map((count: number, idx: number) => {
            const height = (count / maxTraffic) * 100;
            return (
              <div
                key={idx}
                className={`flex-1 transition-all duration-300 ${
                  idx === trafficBars.length - 1 ? 'bg-[#7C6A2E]' : 'bg-[#A48F40]/40 hover:bg-[#A48F40]'
                }`}
                style={{ height: `${Math.max(height, 5)}%` }} // Minimum height of 5% for visibility
                title={`Hour ${idx + 1}: ${count} Requests`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center text-[8px] font-bold tracking-widest text-gray-400 uppercase">
          <span>24 Hours Ago</span>
          <span>Current Traffic</span>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureHealth;
