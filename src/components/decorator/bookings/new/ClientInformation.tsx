import React from 'react';
import { User } from 'lucide-react';

const ClientInformation = () => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <User size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
          CLIENT INFORMATION
        </h3>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* Client Name */}
        <div>
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            CLIENT NAME
          </label>
          <input
            type="text"
            placeholder="Full legal name"
            className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            PHONE NUMBER
          </label>
          <input
            type="text"
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
          EMAIL ADDRESS
        </label>
        <input
          type="email"
          placeholder="client@example.com"
          className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
        />
      </div>
    </div>
  );
};

export default ClientInformation;
