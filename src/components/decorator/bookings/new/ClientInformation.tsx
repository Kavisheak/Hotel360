"use client";

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { validateEmail, validatePhone } from '@/lib/validation';

const ClientInformation = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{email?: string, phone?: string}>({});

  const handleBlur = (field: 'email' | 'phone') => {
    if (field === 'email') {
      if (email && !validateEmail(email)) setErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
    }
    if (field === 'phone') {
      if (phone && !validatePhone(phone)) setErrors(prev => ({ ...prev, phone: "Please enter a valid Sri Lankan phone number." }));
    }
  };
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
            type="tel"
            placeholder="0771234567"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
            }}
            onBlur={() => handleBlur('phone')}
            className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
          />
          {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
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
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
          }}
          onBlur={() => handleBlur('email')}
          className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
        />
        {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
      </div>
    </div>
  );
};

export default ClientInformation;
