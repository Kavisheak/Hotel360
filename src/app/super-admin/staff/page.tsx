import React from 'react';
import Sidebar from '@/components/super-admin/dashboard/Sidebar';
import StaffMain from '@/components/super-admin/staff/StaffMain';

const StaffManagementPage = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
        <StaffMain />
      </div>
    </div>
  );
};

export default StaffManagementPage;
