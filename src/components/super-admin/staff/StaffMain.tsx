"use client";

import React, { useState } from 'react';
import { Star, Pencil, RotateCcw, UserMinus, UserPlus, Download, UserRoundPlus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../dashboard/Header';
import Footer from '../dashboard/Footer';

type Role = 'all' | 'managers' | 'decorators';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  roleCategory: 'managers' | 'decorators' | 'other';
  roleBadge: string;
  rating: number;
  reviews: number;
  status: 'active' | 'on_leave' | 'suspended';
  avatar: string;
}

const staffData: StaffMember[] = [
  {
    id: 1,
    name: 'Eleanor Sterling',
    email: 'eleanor.s@eliteexcellence.com',
    role: 'Senior Manager',
    roleCategory: 'managers',
    roleBadge: 'Senior Manager',
    rating: 5.0,
    reviews: 124,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80',
  },
  {
    id: 2,
    name: 'Julian Vane',
    email: 'j.vane@eliteexcellence.com',
    role: 'Lead Decorator',
    roleCategory: 'decorators',
    roleBadge: 'Lead Decorator',
    rating: 4.8,
    reviews: 89,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80',
  },
  {
    id: 3,
    name: 'Sophia Rossi',
    email: 'sophia.cinema@eliteexcellence.com',
    role: 'Cinematographer',
    roleCategory: 'other',
    roleBadge: 'Cinematographer',
    rating: 4.9,
    reviews: 210,
    status: 'on_leave',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80',
  },
  {
    id: 4,
    name: 'Marcus Thorne',
    email: 'm.thorne@eliteexcellence.com',
    role: 'DJ Artist',
    roleCategory: 'other',
    roleBadge: 'DJ Artist',
    rating: 4.7,
    reviews: 56,
    status: 'suspended',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80',
  },
];

const statusConfig = {
  active:    { label: 'ACTIVE',    dot: 'bg-green-500', text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  on_leave:  { label: 'ON LEAVE',  dot: 'bg-gray-400',  text: 'text-gray-600',  bg: 'bg-gray-50',   border: 'border-gray-200' },
  suspended: { label: 'SUSPENDED', dot: 'bg-red-500',   text: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200' },
};

const avgRating = (staffData.reduce((s, m) => s + m.rating, 0) / staffData.length).toFixed(2);

const StaffMain = () => {
  const [activeRole, setActiveRole] = useState<Role>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const filtered = staffData.filter(m => {
    if (activeRole === 'all') return true;
    if (activeRole === 'managers') return m.roleCategory === 'managers';
    if (activeRole === 'decorators') return m.roleCategory === 'decorators';
    return true;
  });

  const roleTabs: { key: Role; label: string }[] = [
    { key: 'all', label: 'ALL ROLES' },
    { key: 'managers', label: 'MANAGERS' },
    { key: 'decorators', label: 'DECORATORS' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <Header />

      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto w-full">
        {/* Page Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3000] tracking-tight">
              Staff Directory
            </h1>
            <p className="text-sm font-serif italic text-gray-500 mt-1">
              Managing the artisans of exquisite moments
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-[0.15em] uppercase px-5 py-3 hover:bg-[#FAF6EE] transition-colors">
              <Download size={13} />
              EXPORT RECORDS
            </button>
            <button className="flex items-center gap-2 bg-[#7C6A2E] hover:bg-[#5E4F20] text-white font-bold text-[10px] tracking-[0.15em] uppercase px-5 py-3 transition-colors shadow-sm">
              <UserRoundPlus size={13} />
              REGISTER STAFF MEMBER
            </button>
          </div>
        </div>

        {/* Filters + Stats row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Role Tabs + Filter icon */}
          <div className="flex-1 bg-white border border-[#E0D8C3] flex items-center px-4 py-1 gap-1 overflow-x-auto">
            {roleTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveRole(tab.key)}
                className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold tracking-[0.12em] uppercase transition-colors border-b-2 ${
                  activeRole === tab.key
                    ? 'border-[#7C6A2E] text-[#7C6A2E]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {/* Separator */}
            <div className="w-px h-5 bg-[#E0D8C3] mx-2 shrink-0" />
            {/* Filter toggle */}
            <button className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase whitespace-nowrap hover:text-[#7C6A2E] transition-colors px-2">
              <Filter size={12} />
              ACTIVE FILTERS: NONE
            </button>
          </div>

          {/* Avg Rating Card */}
          <div className="flex items-center gap-4 bg-[#FAF8F2] border border-[#E0D8C3] px-6 py-3 shrink-0">
            <Star size={22} className="text-[#B08D2C]" />
            <div>
              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">Avg Provider Rating</p>
              <p className="text-2xl font-serif font-bold text-[#3D3000] leading-none">
                {avgRating}
                <span className="text-sm text-gray-400 font-semibold">/5.0</span>
              </p>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white border border-[#E0D8C3] overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_auto] bg-[#B08D2C] px-4 sm:px-6 py-3 gap-4 min-w-[640px]">
            {['STAFF MEMBER', 'ROLE', 'RATING', 'STATUS', 'ACTIONS'].map(col => (
              <p key={col} className="text-[9px] font-bold tracking-[0.18em] text-white uppercase">{col}</p>
            ))}
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#F2EADA] min-w-[640px]">
            {filtered.map((member) => {
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
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-[#B08D2C] shrink-0" />
                    <span className="text-sm font-bold text-gray-800">{member.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-gray-400 font-medium">({member.reviews} reviews)</span>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 border rounded-sm ${st.bg} ${st.text} ${st.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  {/* Actions */}
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-[#F2EADA] gap-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Showing {filtered.length} of 28 Staff Members
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center border border-[#E0D8C3] text-gray-500 hover:bg-[#F2EADA] transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="w-8 h-8 flex items-center justify-center border border-[#E0D8C3] text-gray-500 hover:bg-[#F2EADA] transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StaffMain;
