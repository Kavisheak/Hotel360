"use client";

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const PackageTheme = () => {
  const [selectedPackage, setSelectedPackage] = useState('diamond');

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Sparkles size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
          PACKAGE & THEME
        </h3>
      </div>

      <div className="space-y-5">
        {/* Service Package Title */}
        <div>
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-3 uppercase">
            SERVICE PACKAGE
          </label>

          {/* Cards List */}
          <div className="space-y-3">
            {/* Gold Package */}
            <div 
              onClick={() => setSelectedPackage('gold')}
              className={`border p-4 flex items-center space-x-3 cursor-pointer transition-all ${
                selectedPackage === 'gold' 
                  ? 'border-[#7C6A2E] bg-[#FCF6E3]' 
                  : 'border-[#E0D8C3] hover:bg-[#FAF6EE]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                selectedPackage === 'gold' ? 'border-[#7C6A2E]' : 'border-gray-300'
              }`}>
                {selectedPackage === 'gold' && <div className="w-2 h-2 rounded-full bg-[#7C6A2E]" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">GOLD PACKAGE</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Standard luxury essentials</p>
              </div>
            </div>

            {/* Diamond Package */}
            <div 
              onClick={() => setSelectedPackage('diamond')}
              className={`border p-4 flex items-center space-x-3 cursor-pointer transition-all ${
                selectedPackage === 'diamond' 
                  ? 'border-[#7C6A2E] bg-[#FCF6E3]' 
                  : 'border-[#E0D8C3] hover:bg-[#FAF6EE]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                selectedPackage === 'diamond' ? 'border-[#7C6A2E]' : 'border-gray-300'
              }`}>
                {selectedPackage === 'diamond' && <div className="w-2 h-2 rounded-full bg-[#7C6A2E]" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">DIAMOND PACKAGE</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Full venue transformation</p>
              </div>
            </div>

            {/* Custom Selection */}
            <div 
              onClick={() => setSelectedPackage('custom')}
              className={`border p-4 flex items-center space-x-3 cursor-pointer transition-all ${
                selectedPackage === 'custom' 
                  ? 'border-[#7C6A2E] bg-[#FCF6E3]' 
                  : 'border-[#E0D8C3] hover:bg-[#FAF6EE]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                selectedPackage === 'custom' ? 'border-[#7C6A2E]' : 'border-gray-300'
              }`}>
                {selectedPackage === 'custom' && <div className="w-2 h-2 rounded-full bg-[#7C6A2E]" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">CUSTOM SELECTION</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Bespoke a-la-carte services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Theme */}
        <div>
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            MAIN THEME
          </label>
          <input
            type="text"
            placeholder="e.g., Floral Excellence"
            className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>
      </div>
    </div>
  );
};

export default PackageTheme;
