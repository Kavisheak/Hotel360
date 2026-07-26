"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/super-admin/dashboard/Sidebar';
import { superAdminAPI } from '@/lib/api';
import ConfigHeader from './ConfigHeader';
import VirtualExperience from './VirtualExperience';
import AISentiment from './AISentiment';
import PlatformSecurity from './PlatformSecurity';
import InfrastructureHealth from './InfrastructureHealth';

const ConfigMain = () => {
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await superAdminAPI.getConfigHealth();
        if (res.ok) {
          setHealthData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch health data", err);
      }
    };
    fetchHealth();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDiscard = () => {
    alert('Configuration changes discarded.');
  };

  const handleSave = () => {
    alert('Configuration saved successfully.');
  };

  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800 flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0">
        <ConfigHeader />

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-[1400px] mx-auto w-full flex flex-col justify-between">
          <div className="space-y-6">
            {/* Title Area */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#7C6A2E] tracking-tight mb-2">
                  System Configuration
                </h1>
                <p className="text-sm italic text-gray-500 font-serif">
                  Fine-tuning the architectural excellence of EASCCA.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDiscard}
                  className="border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase px-6 py-2.5 hover:bg-[#FAF6EE] transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#A48F40] hover:bg-[#8D7B37] text-white font-bold text-[10px] tracking-widest uppercase px-6 py-2.5 transition-colors shadow-sm"
                >
                  Save Config
                </button>
              </div>
            </div>

            {/* Config Panels Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Row 1 Left - Virtual Experience (7/12) */}
              <div className="xl:col-span-7">
                <VirtualExperience />
              </div>
              {/* Row 1 Right - AI Sentiment (5/12) */}
              <div className="xl:col-span-5">
                <AISentiment />
              </div>

              {/* Row 2 Left - Platform Security (7/12 or 6/12) */}
              <div className="xl:col-span-6">
                <PlatformSecurity />
              </div>
              {/* Row 2 Right - Infrastructure Health (5/12 or 6/12) */}
              <div className="xl:col-span-6">
                <InfrastructureHealth data={healthData} />
              </div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="border-t border-[#E0D8C3] mt-12 pt-6 pb-2 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
            <span>© 2024 EASCCA LUXURY WEDDING SYSTEMS. VERSION 4.1.2-ELITE</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-700 transition-colors">Technical Docs</a>
              <a href="#" className="hover:text-gray-700 transition-colors">API Keys</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Emergency Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigMain;
