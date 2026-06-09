import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

const PlatformSecurity = () => {
  const [jwtExpiry, setJwtExpiry] = useState('8 Hours (Shift Duration)');
  const [loginLimit, setLoginLimit] = useState('5');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 border border-[#E0D8C3] rounded text-[#7C6A2E]">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-950">Platform Security</h2>
        </div>
      </div>

      {/* Main Form Fields + Maintenance Mode side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
              JWT Token Expiry (Hours)
            </label>
            <input
              type="text"
              value={jwtExpiry}
              onChange={(e) => setJwtExpiry(e.target.value)}
              className="w-full border border-[#E0D8C3] text-xs py-3 px-4 text-gray-700 bg-transparent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
              Failed Login Attempt Limit
            </label>
            <input
              type="text"
              value={loginLimit}
              onChange={(e) => setLoginLimit(e.target.value)}
              className="w-full border border-[#E0D8C3] text-xs py-3 px-4 text-gray-700 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Maintenance Mode Box */}
        <div className="bg-[#FAF6EE] border border-[#E0D8C3] p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-red-700 uppercase">
              Maintenance Mode
            </span>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-none ${
                maintenanceMode ? 'bg-[#B08D2C]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                  maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed mt-4">
            When enabled, the public platform will be inaccessible for booking. Admins retain full access.
          </p>
        </div>
      </div>

      {/* Rotate Keys Button */}
      <div className="pt-2">
        <button className="w-full border border-[#E0D8C3] hover:bg-[#FAF6EE] text-gray-800 font-bold text-[10px] tracking-widest uppercase py-3 transition-colors">
          Rotate Encryption Keys
        </button>
      </div>
    </div>
  );
};

export default PlatformSecurity;
