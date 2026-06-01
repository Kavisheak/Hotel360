"use client";

import React, { useState, useEffect } from 'react';
import SettingsHeader from './SettingsHeader';
import SettingsSidebar from './SettingsSidebar';
import PersonalProfile from './PersonalProfile';
import Security from './Security';
import NotificationPreferences from './NotificationPreferences';
import VenueConfiguration from './VenueConfiguration';
import ManagerFooter from '../overview/Footer';

const SettingsMain = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Optional: Update active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['profile', 'security', 'notifications', 'venue'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold based on your header height
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      if (current && current !== activeTab) {
        setActiveTab(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
        <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Settings</h2>
      </header>

      <main className="flex-1 px-4 lg:px-8 py-8 lg:py-10 max-w-6xl mx-auto w-full">
        <SettingsHeader />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Left Sidebar Menu */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0 pb-20">
            <div id="profile"><PersonalProfile /></div>
            <div id="security"><Security /></div>
            <div id="notifications"><NotificationPreferences /></div>
            <div id="venue"><VenueConfiguration /></div>
          </div>
        </div>
      </main>

      <ManagerFooter />
    </div>
  );
};

export default SettingsMain;
