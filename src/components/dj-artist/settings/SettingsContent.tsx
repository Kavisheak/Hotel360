import React from 'react';
import Header from './Header';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';
import AvailabilitySettings from './AvailabilitySettings';
import SecuritySettings from './SecuritySettings';

const SettingsContent = () => {
  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col bg-[#FDF9F1]">
      <div className="px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] gap-6 mb-6">
          <div className="space-y-6">
            <ProfileSettings />
            <AccountSettings />
          </div>

          <div className="space-y-6">
            <AvailabilitySettings />
            <NotificationSettings />
            <SecuritySettings />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-2">
          <button className="border border-[#B08D2C] bg-transparent px-8 py-3 text-xs font-semibold tracking-widest text-[#7C6A2E] transition-colors hover:bg-[#FDF9F1]">
            RESET CHANGES
          </button>
          <button className="bg-[#7C6A2E] px-8 py-3 text-xs font-semibold tracking-widest text-white shadow-md transition-colors hover:bg-[#685724]">
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </main>
  );
};

export default SettingsContent;
