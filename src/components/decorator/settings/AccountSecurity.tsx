"use client";

import React, { useState } from 'react';
import { Shield } from 'lucide-react';

const AccountSecurity = () => {
  const [tfaActive, setTfaActive] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Account Security Card */}
      <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
        {/* Title */}
        <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
          <Shield size={16} className="text-[#B08D2C]" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
            ACCOUNT SECURITY
          </h3>
        </div>

        <div className="space-y-6 mb-8">
          {/* Password Row */}
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <span className="text-xs font-semibold text-gray-700">Password</span>
            <button className="text-[10px] font-bold tracking-widest text-[#7C6A2E] hover:text-[#9B7A20] uppercase underline underline-offset-2 transition-colors">
              CHANGE
            </button>
          </div>

          {/* 2FA Row */}
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <div>
              <span className="text-xs font-semibold text-gray-700">Two-Factor Auth</span>
              <p className="text-[8px] font-bold tracking-widest text-[#3F6897] uppercase mt-0.5">RECOMMENDED</p>
            </div>
            {/* Custom Gold Switch Toggle */}
            <button 
              onClick={() => setTfaActive(!tfaActive)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                tfaActive ? 'bg-[#7C6A2E]' : 'bg-gray-200'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${
                  tfaActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Info & Revoke */}
        <div className="space-y-4">
          <p className="text-[8px] font-bold text-gray-400 tracking-[0.15em] uppercase">
            LAST LOGIN: TODAY AT 09:42 AM
          </p>
          <button className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase">
            REVOKE ALL SESSIONS
          </button>
        </div>
      </div>

      {/* Timeless Elegance Visual Card */}
      <div className="bg-white border border-[#E0D8C3] p-4 shadow-sm relative overflow-hidden h-72 group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
          alt="Timeless Elegance"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Transparent Elegant Overlay */}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5">
          <h4 className="text-white text-lg font-serif font-bold italic tracking-wide leading-tight">
            "Timeless Elegance"
          </h4>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;
