"use client";

import React, { useState, useEffect } from 'react';
import { type Role, statusConfig } from './types';
import StaffHeader from './StaffHeader';
import StaffFilters from './StaffFilters';
import StaffTable from './StaffTable';
import Header from '@/components/super-admin/dashboard/Header';
import Footer from '@/components/super-admin/dashboard/Footer';
import ChangeManagerModal from './ChangeManagerModal';
import RegisterStaffModal from './RegisterStaffModal';
import EditStaffModal from './EditStaffModal';
import { superAdminAPI } from '@/lib/api';

const StaffMain = () => {
  const [activeRole, setActiveRole] = useState<Role>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any>(null);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await superAdminAPI.getStaff();
      if (res.ok && res.data?.data) {
        // Map backend User data to frontend StaffMember format
        const formatted = res.data.data.map((u: any) => {
          let roleCategory = 'other';
          let roleBadge = 'Staff';
          if (u.role === 'manager') { roleCategory = 'managers'; roleBadge = 'Manager'; }
          if (u.role === 'decorator') { roleCategory = 'decorators'; roleBadge = 'Decorator'; }
          if (u.role === 'dj_artist') { roleCategory = 'djs'; roleBadge = 'DJ Artist'; }
          if (u.role === 'videographer') { roleCategory = 'videographers'; roleBadge = 'Videographer'; }

          return {
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            role: u.role,
            roleCategory,
            roleBadge,
            rating: u.rating || 0,
            reviews: u.reviewsCount || 0,
            status: u.isActive ? 'active' : 'suspended',
            avatar: u.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80',
            completedEvents: u.completedEvents || 0,
            assignedThisWeek: u.assignedThisWeek || 0,
            availability: u.availability || 'Unknown',
          };
        });
        setStaffData(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);


  const filtered = staffData.filter(m => {
    if (activeRole === 'managers') return m.roleCategory === 'managers';
    if (activeRole === 'decorators') return m.roleCategory === 'decorators';
    if (activeRole === 'videographers') return m.roleCategory === 'videographers';
    if (activeRole === 'djs') return m.roleCategory === 'djs';
    return true;
  });

  const itemsPerPage = 10;
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleStatusToggle = async (userId: string) => {
    try {
      const res = await superAdminAPI.toggleStaffStatus(userId);
      if (res.ok) {
        fetchStaff(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <Header />

      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto w-full">
        <StaffHeader
          onOpenChangeManager={() => setIsManagerModalOpen(true)}
          onOpenRegisterStaff={() => setIsRegisterModalOpen(true)}
        />

        <StaffFilters
          activeRole={activeRole}
          onRoleChange={role => { setActiveRole(role); setCurrentPage(1); }}
          avgRating={
            staffData.length > 0
              ? (staffData.reduce((sum, m) => sum + (m.rating || 0), 0) / staffData.length).toFixed(2)
              : "0.00"
          }
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08D2C]"></div>
          </div>
        ) : (
          <StaffTable
            members={paginated}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={setCurrentPage}
            onToggleStatus={handleStatusToggle}
            onEdit={(member) => {
              setMemberToEdit(member);
              setIsEditModalOpen(true);
            }}
          />
        )}
      </div>

      <Footer />

      <ChangeManagerModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        staffData={staffData}
      />

      <RegisterStaffModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={fetchStaff}
      />

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchStaff}
        member={memberToEdit}
      />
    </div>
  );
};

export default StaffMain;
