import React from 'react';
import SettingsHeader from './SettingsHeader';
import PersonalProfile from './PersonalProfile';
import AccountSecurity from './AccountSecurity';
import NotificationPreferences from './NotificationPreferences';
import Footer from '../my_jobs/Footer';

const SettingsMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Settings Header with Top Mini bar & Notification Bell */}
        <SettingsHeader />

        {/* 2-Column Grid for Personal Profile and Account Security */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PersonalProfile />
          </div>
          <div>
            <AccountSecurity />
          </div>
        </div>

        {/* Bottom Checklist for Alerts */}
        <NotificationPreferences />
      </div>
      <Footer />
    </div>
  );
};

export default SettingsMain;
