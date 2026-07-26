"use client";

import React from 'react';
import UnifiedVendorSettings from '@/components/vendor/UnifiedVendorSettings';
import Footer from '../overview/Footer';

const SettingsMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1] dark:bg-[#0A0A0A]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <UnifiedVendorSettings vendorRole="dj_artist" roleTitle="DJ & Audio Artist" />
      </div>
      <Footer />
    </div>
  );
};

export default SettingsMain;
