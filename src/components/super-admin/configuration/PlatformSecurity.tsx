import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

const PlatformSecurity = ({ data, onChange }: any) => {
  if (!data) return null;

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
              Manager Idle Logout (Minutes)
            </label>
            <input
              type="number"
              value={data.managerIdleLogout}
              onChange={(e) => onChange({ ...data, managerIdleLogout: Number(e.target.value) })}
              className="w-full border border-[#E0D8C3] text-xs py-3 px-4 text-gray-700 bg-transparent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
              Require Staff 2FA
            </label>
            <input
              type="text"
              value={data.require2FA}
              readOnly
              className="w-full border border-[#E0D8C3] text-xs py-3 px-4 text-gray-700 bg-transparent focus:outline-none opacity-80"
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
              onClick={() => onChange({ ...data, maintenanceMode: !data.maintenanceMode })}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-none ${data.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${data.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed mt-4">
            When enabled, the public booking platform will be entirely blocked. Super Admins retain full bypass access.
          </p>
        </div>
      </div>

      {/* Security Actions */}
      <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
        <button className="w-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 font-bold text-[9px] tracking-widest uppercase py-3 transition-colors">
          FORCE LOGOUT EVERYONE
        </button>
        <button className="w-full border border-[#E0D8C3] hover:bg-[#FAF6EE] text-gray-800 font-bold text-[9px] tracking-widest uppercase py-3 transition-colors">
          RESET STAFF PASSWORDS
        </button>
        <button className="w-full border border-[#E0D8C3] hover:bg-[#FAF6EE] text-gray-800 font-bold text-[9px] tracking-widest uppercase py-3 transition-colors">
          REVOKE API TOKENS
        </button>
      </div>
    </div>
  );
};

export default PlatformSecurity;
