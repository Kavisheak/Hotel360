import React from 'react';
import { SectionTitle } from './SectionTitle';

const Security = () => (
  <div className="mb-12">
    <SectionTitle title="Security" />
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Current Password</label>
          <input type="password" defaultValue="........" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
        </div>
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">New Password</label>
          <input type="password" defaultValue="........" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-[#E0D8C3] gap-4">
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-800 mb-1">Two-Factor Authentication</h4>
          <p className="text-[10px] text-gray-500">Add an extra layer of security to your account.</p>
        </div>
        <button className="border border-[#B08D2C] text-[#7C6A2E] hover:bg-[#FDF9F1] text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors whitespace-nowrap">
          Enable 2FA
        </button>
      </div>
    </div>
  </div>
);

export default Security;
