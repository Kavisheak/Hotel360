import React from 'react';
import { Palette } from 'lucide-react';

const DecorationSpecifications = () => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Palette size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
          DECORATION SPECIFICATIONS
        </h3>
      </div>

      <div className="space-y-5">
        {/* Key Design Elements */}
        <div>
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            KEY DESIGN ELEMENTS
          </label>
          <textarea
            rows={4}
            placeholder="Describe floral arrangements, centerpieces, ceiling treatments..."
            className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C] resize-none leading-relaxed"
          />
        </div>

        {/* Special Client Notes */}
        <div>
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            SPECIAL CLIENT NOTES
          </label>
          <textarea
            rows={3}
            placeholder="Dietary restrictions for staff, specific arrival instructions..."
            className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C] resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default DecorationSpecifications;
