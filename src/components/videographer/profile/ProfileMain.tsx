import React from 'react';
import Footer from '../shared/Footer';
import ProfileHeader from './ProfileHeader';
import PersonalProfile from './PersonalProfile';
import AccountSecurity from './AccountSecurity';
import PortfolioInformation from './PortfolioInformation';

const ProfileMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PersonalProfile />
          </div>
          <div>
            <AccountSecurity />
          </div>
        </div>

        <PortfolioInformation />
      </div>
      <Footer />
    </div>
  );
};

export default ProfileMain;
