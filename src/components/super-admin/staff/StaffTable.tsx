"use client";

import React from 'react';
import { Star, Pencil, RotateCcw, UserMinus, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { type StaffMember, statusConfig } from './staffData';

interface StaffTableProps {
  members: StaffMember[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const StaffTable = ({ members, currentPage, totalPages, totalCount, onPageChange }: StaffTableProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] overflow-x-auto">
      {/* Gold Column Header Row */}
      <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_auto] bg-[#B08D2C] px-4 sm:px-6 py-3 gap-4 min-w-[640px]">
        {['STAFF MEMBER', 'ROLE', 'RATING', 'STATUS', 'ACTIONS'].map(col => (
          <p key={col} className="text-[9px] font-bold tracking-[0.18em] text-white uppercase">{col}</p>
        ))}
      </div>

      {/* Staff Rows */}
      <div className="divide-y divide-[#F2EADA] min-w-[640px]">
        {members.map(member => {
          const st = statusConfig[member.status];
          return (
            <div
              key={member.id}
              className="grid grid-cols-[2fr_1.2fr_1fr_1fr_auto] items-center px-4 sm:px-6 py-4 gap-4 hover:bg-[#FDFAF4] transition-colors"
            >
              {/* Staff Member */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-sm object-cover border border-[#E0D8C3] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{member.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium truncate">{member.email}</p>
                </div>
              </div>

              {/* Role Badge */}
              <div>
                <span className="inline-block bg-[#F9DD76] text-[#5E4F20] text-[9px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-sm whitespace-nowrap">
                  {member.roleBadge}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 flex-wrap">
                <Star size={12} className="text-[#B08D2C] shrink-0" />
                <span className="text-sm font-bold text-gray-800">{member.rating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400 font-medium">({member.reviews} reviews)</span>
              </div>

              {/* Status Badge */}
              <div>
                <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 border rounded-sm ${st.bg} ${st.text} ${st.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-[#7C6A2E] transition-colors" title="Edit">
                  <Pencil size={15} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-[#7C6A2E] transition-colors" title="View History">
                  <RotateCcw size={15} />
                </button>
                {member.status === 'suspended' ? (
                  <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Reactivate">
                    <UserPlus size={15} />
                  </button>
                ) : (
                  <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Suspend">
                    <UserMinus size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-[#F2EADA] gap-3">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Showing {members.length} of {totalCount} Staff Members
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="w-8 h-8 flex items-center justify-center border border-[#E0D8C3] text-gray-500 hover:bg-[#F2EADA] transition-colors"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold border transition-colors ${
                currentPage === page
                  ? 'bg-[#7C6A2E] text-white border-[#7C6A2E]'
                  : 'border-[#E0D8C3] text-gray-600 hover:bg-[#F2EADA]'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="w-8 h-8 flex items-center justify-center border border-[#E0D8C3] text-gray-500 hover:bg-[#F2EADA] transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffTable;
