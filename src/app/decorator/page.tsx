import React from 'react';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import MainContent from '@/components/decorator/my_jobs/MainContent';

const DecoratorMyJobs = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1">
        <MainContent />
      </div>
    </div>
  );
};

export default DecoratorMyJobs;
