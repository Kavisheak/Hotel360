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
    <div className="bg-white border border-[#E0D8C3] p-6">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-6">
        <Globe size={15} className="text-[#B08D2C]" />
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">Global Parameters</p>
      </div>

      {/* Standard Deposit Slider */}
      <div className="mb-5">
        <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">
          Standard Deposit Percentage
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={deposit}
          onChange={e => onDepositChange(Number(e.target.value))}
          className="w-full accent-[#B08D2C] h-1.5 cursor-pointer"
        />
        <div className="flex justify-end mt-1.5">
          <span className="text-sm font-bold text-gray-700">{deposit}%</span>
        </div>
      </div>

      {/* Tax Rate */}
      <div className="mb-5">
        <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">
          Tax Rate (VAT/GST)
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={taxRate}
            onChange={e => onTaxRateChange(e.target.value)}
            className="flex-1 border border-[#E0D8C3] px-3 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#B08D2C] transition-colors"
          />
          <span className="text-sm font-bold text-gray-400">%</span>
        </div>
      </div>

      {/* Currency Display */}
      <div className="mb-6">
        <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">
          Currency Display
        </p>
        <div className="relative">
          <select
            value={currency}
            onChange={e => onCurrencyChange(e.target.value)}
            className="w-full border border-[#E0D8C3] px-3 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] appearance-none bg-white pr-8 transition-colors cursor-pointer"
          >
            <option>USD ($) - US Dollar</option>
            <option>EUR (€) - Euro</option>
            <option>GBP (£) - British Pound</option>
            <option>AED (د.إ) - UAE Dirham</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* System-wide Enforcement Toggle */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F2EADA]">
        <p className="text-[10px] font-semibold text-gray-500 italic">System-wide enforcement</p>
        <div className="flex items-center gap-2">
          <div
            onClick={onEnforcementToggle}
            className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
              enforcement ? 'bg-[#B08D2C]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                enforcement ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${enforcement ? 'text-[#B08D2C]' : 'text-gray-400'}`}>
            {enforcement ? 'ENABLED' : 'DISABLED'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalParameters;
