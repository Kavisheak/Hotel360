"use client";

import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { validateEmail } from '@/lib/validation';

const AccountSettings = () => {
  const [email, setEmail] = useState('a.malik@framestory.co');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
  };
  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Shield size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">ACCOUNT SETTINGS</h3>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Update your account information and confirm the changes before publishing to your videographer portal.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Display Name</label>
          <input
            type="text"
            defaultValue="A. Malik"
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Booking Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
          {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
        </div>

        <button onClick={handleSave} className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase">
          Save Account Updates
        </button>
      </div>
    </article>
  );
};

export default AccountSettings;
