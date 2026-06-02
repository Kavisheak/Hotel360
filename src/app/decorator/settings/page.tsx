import React from 'react';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import SettingsMain from '@/components/decorator/settings/SettingsMain';

const DecoratorSettings = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <SettingsMain />
      </div>
    </div>
  );
};

export default DecoratorSettings;
