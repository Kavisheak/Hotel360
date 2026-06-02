import React from 'react';
import { SectionTitle } from './SectionTitle';

const PersonalProfile = () => (
  <div className="mb-12">
    <SectionTitle title="Personal Profile" />
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
          <input type="text" defaultValue="Ahmed Sattar" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
        </div>
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
          <input type="email" defaultValue="ahmed.sattar@sattarelite.com" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
        </div>
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
          <input type="text" defaultValue="+92 300 1234567" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
        </div>
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Language Preference</label>
          <select className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] appearance-none">
            <option>English (UK)</option>
            <option>English (US)</option>
          </select>
        </div>
      </div>
      <button className="bg-[#7C6A2E] hover:bg-[#635525] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors">
        Save Profile Changes
      </button>
    </div>
  </div>
);

export default PersonalProfile;
