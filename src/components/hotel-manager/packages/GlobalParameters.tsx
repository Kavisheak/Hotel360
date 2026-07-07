"use client";

import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface GlobalParametersProps {
  deposit: number;
  onDepositChange: (val: number) => void;
  taxRate: string;
  onTaxRateChange: (val: string) => void;
  currency: string;
  onCurrencyChange: (val: string) => void;
  enforcement: boolean;
  onEnforcementToggle: () => void;
}

const GlobalParameters = ({
  deposit, onDepositChange,
  taxRate, onTaxRateChange,
  currency, onCurrencyChange,
  enforcement, onEnforcementToggle
}: GlobalParametersProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
      {/* Title */}
      <div className="flex items-center gap-2 mb-8">
        <Globe size={16} className="text-[#B08D2C]" />
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#7C6A2E] uppercase">
          Global Parameters
        </span>
      </div>

      {/* Deposit Slider */}
      <div className="mb-6">
        <label className="block text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">
          Standard Deposit Percentage
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            value={deposit}
            onChange={(e) => onDepositChange(Number(e.target.value))}
            className="flex-1 accent-[#B08D2C] h-1 cursor-pointer bg-gray-200 rounded-lg appearance-none"
          />
          <span className="text-sm font-bold text-gray-900 min-w-[32px] text-right">
            {deposit}%
          </span>
        </div>
      </div>

      {/* Tax Rate Input */}
      <div className="mb-6">
        <label className="block text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">
          Tax Rate (VAT/GST)
        </label>
        <div className="relative">
          <input
            type="text"
            value={taxRate}
            onChange={(e) => onTaxRateChange(e.target.value)}
            className="w-full border border-[#E0D8C3] px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#B08D2C] transition-colors pr-10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
            %
          </span>
        </div>
      </div>

      {/* Currency Display */}
      <div className="mb-8">
        <label className="block text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">
          Currency Display
        </label>
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full border border-[#E0D8C3] px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#B08D2C] appearance-none bg-white pr-10 cursor-pointer"
          >
            <option>USD ($) - US Dollar</option>
            <option>EUR (€) - Euro</option>
            <option>GBP (£) - British Pound</option>
            <option>AED (د.إ) - UAE Dirham</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between pt-6 border-t border-[#F2EADA]">
        <span className="text-[10px] font-semibold text-gray-500 italic">
          System-wide enforcement
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onEnforcementToggle}
            className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-none ${
              enforcement ? 'bg-[#B08D2C]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                enforcement ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${enforcement ? 'text-[#B08D2C]' : 'text-gray-400'}`}>
            {enforcement ? 'ENABLED' : 'DISABLED'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalParameters;
