import React from 'react';
import { Download, UserRoundPlus, UserCog } from 'lucide-react';

interface StaffHeaderProps {
  onOpenChangeManager: () => void;
}

const StaffHeader = ({ onOpenChangeManager }: StaffHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3000] tracking-tight">
          Staff Directory
        </h1>
        <p className="text-sm font-serif italic text-gray-500 mt-1">
          Managing the artisans of exquisite moments
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="flex items-center gap-2 border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-[0.15em] uppercase px-5 py-3 hover:bg-[#FAF6EE] transition-colors">
          <Download size={13} />
          EXPORT RECORDS
        </button>
        <button 
          onClick={onOpenChangeManager}
          className="flex items-center gap-2 border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-[0.15em] uppercase px-5 py-3 hover:bg-[#FAF6EE] transition-colors bg-white"
        >
          <UserCog size={13} />
          CHANGE LEAD MANAGER
        </button>
        <button className="flex items-center gap-2 bg-[#7C6A2E] hover:bg-[#5E4F20] text-white font-bold text-[10px] tracking-[0.15em] uppercase px-5 py-3 transition-colors shadow-sm">
          <UserRoundPlus size={13} />
          REGISTER STAFF MEMBER
        </button>
      </div>
    </div>
  );
};

export default StaffHeader;
