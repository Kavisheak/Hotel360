import React from 'react';
import { MoreVertical } from 'lucide-react';
import { SupplementalFee } from './packagesData';

interface SupplementalFeesProps {
  fees: SupplementalFee[];
  onFeeChange: (id: string, val: number) => void;
}

const SupplementalFees = ({ fees, onFeeChange }: SupplementalFeesProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3]">
      {/* Gold Header Bar */}
      <div className="flex justify-between items-center px-6 sm:px-8 py-4 bg-[#B08D2C]">
        <p className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
          Supplemental Service Fees
        </p>
        <p className="text-[10px] text-yellow-100 font-semibold italic">Last synced: 2 hours ago</p>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[1.5fr_2fr_1.2fr_40px] px-6 sm:px-8 py-3 border-b border-[#F2EADA] gap-4">
        {['SERVICE CATEGORY', 'PACKAGE NAME', 'FEE STRUCTURE', 'ACTION'].map(col => (
          <p key={col} className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">{col}</p>
        ))}
      </div>

      {/* Fee Rows */}
      <div className="divide-y divide-[#F2EADA]">
        {fees.map(fee => (
          <div
            key={fee.id}
            className="grid grid-cols-[1.5fr_2fr_1.2fr_40px] items-center px-6 sm:px-8 py-4 gap-4 hover:bg-[#FDFAF4] transition-colors"
          >
            <p className="text-sm font-semibold text-gray-700">{fee.category}</p>
            <p className="text-sm font-serif italic text-gray-500">{fee.packageName}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-400 shrink-0">$</span>
              <input
                type="number"
                value={fee.fee}
                onChange={e => onFeeChange(fee.id, Number(e.target.value))}
                className="w-full border border-[#E0D8C3] px-2 py-1.5 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#B08D2C] transition-colors"
              />
            </div>
            <button className="text-gray-400 hover:text-[#7C6A2E] transition-colors flex justify-center">
              <MoreVertical size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplementalFees;
