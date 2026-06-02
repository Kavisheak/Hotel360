"use client";

import React, { useState } from 'react';
import { Shield } from 'lucide-react';

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Shield size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">SECURITY SETTINGS</h3>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Current Password</label>
            <input type="password" className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">New Password</label>
            <input type="password" className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Confirm New Password</label>
          <input type="password" className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]" />
        </div>

        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <div>
            <span className="text-xs font-semibold text-gray-700">Two-Factor Authentication</span>
            <p className="text-[8px] font-bold tracking-widest text-[#3F6897] uppercase mt-0.5">RECOMMENDED</p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFactorEnabled((previous) => !previous)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
              twoFactorEnabled ? 'bg-[#7C6A2E]' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase">
          Revoke All Sessions
        </button>
      </div>
    </article>
  );
};

export default SecuritySettings;
