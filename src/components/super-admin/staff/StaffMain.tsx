"use client";

import React, { useState } from 'react';
import { staffData, type Role } from './staffData';
import StaffHeader from './StaffHeader';
import StaffFilters from './StaffFilters';
import StaffTable from './StaffTable';
import Header from '@/components/super-admin/dashboard/Header';
import Footer from '@/components/super-admin/dashboard/Footer';
import ChangeManagerModal from './ChangeManagerModal';

const TOTAL_COUNT = 28;
const TOTAL_PAGES = 3;

const StaffMain = () => {
  const [activeRole, setActiveRole] = useState<Role>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  const filtered = staffData.filter(m => {
    if (activeRole === 'managers')      return m.roleCategory === 'managers';
    if (activeRole === 'decorators')    return m.roleCategory === 'decorators';
    if (activeRole === 'videographers') return m.roleCategory === 'videographers';
    if (activeRole === 'djs')           return m.roleCategory === 'djs';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <Header />

      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto w-full">
        <StaffHeader onOpenChangeManager={() => setIsManagerModalOpen(true)} />

        <StaffFilters
          activeRole={activeRole}
          onRoleChange={role => { setActiveRole(role); setCurrentPage(1); }}
        />

        <StaffTable
          members={filtered}
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          totalCount={TOTAL_COUNT}
          onPageChange={setCurrentPage}
        />
      </div>

      <Footer />

      <ChangeManagerModal 
        isOpen={isManagerModalOpen} 
        onClose={() => setIsManagerModalOpen(false)} 
      />
    </div>
  );
};

export default StaffMain;
