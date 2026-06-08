"use client";

import React from 'react';
import { Star, Filter } from 'lucide-react';
import { type Role, avgRating } from './staffData';

interface StaffFiltersProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

const roleTabs: { key: Role; label: string }[] = [
  { key: 'all',        label: 'ALL ROLES'   },
  { key: 'managers',   label: 'MANAGERS'    },
  { key: 'decorators', label: 'DECORATORS'  },
];

const StaffFilters = ({ activeRole, onRoleChange }: StaffFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Role Tabs + Filter Icon */}
      <div className="flex-1 bg-white border border-[#E0D8C3] flex items-center px-4 py-1 gap-1 overflow-x-auto">
        {roleTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onRoleChange(tab.key)}
            className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold tracking-[0.12em] uppercase transition-colors border-b-2 ${
              activeRole === tab.key
                ? 'border-[#7C6A2E] text-[#7C6A2E]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-5 bg-[#E0D8C3] mx-2 shrink-0" />

        {/* Filter Toggle */}
        <button className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase whitespace-nowrap hover:text-[#7C6A2E] transition-colors px-2">
          <Filter size={12} />
          ACTIVE FILTERS: NONE
        </button>
      </div>

      {/* Avg Rating Card */}
      <div className="flex items-center gap-4 bg-[#FAF8F2] border border-[#E0D8C3] px-6 py-3 shrink-0">
        <Star size={22} className="text-[#B08D2C]" />
        <div>
          <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
            Avg Provider Rating
          </p>
          <p className="text-2xl font-serif font-bold text-[#3D3000] leading-none">
            {avgRating}
            <span className="text-sm text-gray-400 font-semibold">/5.0</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffFilters;
