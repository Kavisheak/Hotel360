import React from 'react';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import HistoryMain from '@/components/decorator/history/historyMain';

const DecoratorHistory = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <HistoryMain />
      </div>
    </div>
  );
};

export default DecoratorHistory;
