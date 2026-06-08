import React from 'react';
import { Shield } from 'lucide-react';

const AccountSettings = () => {
  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Shield size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">ACCOUNT SETTINGS</h3>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Update your profile information and confirm the changes before publishing to your DJ portal.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Display Name</label>
          <input
            type="text"
            defaultValue="Julian Saint-Clair"
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Booking Email</label>
          <input
            type="email"
            defaultValue="julian@aureumentertainment.com"
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>

        <button className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase">
          Save Profile Updates
        </button>
      </div>
    </article>
  );
};

export default AccountSettings;
