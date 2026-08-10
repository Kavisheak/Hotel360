"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/super-admin/dashboard/Sidebar';
import { superAdminAPI } from '@/lib/api';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import ConfigHeader from './ConfigHeader';
import VirtualExperience from './VirtualExperience';
import AISentiment from './AISentiment';
import PlatformSecurity from './PlatformSecurity';
import BookingRules from './BookingRules';

const ConfigMain = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [healthRes, configRes] = await Promise.all([
        superAdminAPI.getConfigHealth(),
        superAdminAPI.getPlatformConfig()
      ]);
      if (healthRes.ok) setHealthData(healthRes.data?.data);
      if (configRes.ok) setConfig(configRes.data?.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDiscard = () => {
    fetchData();
    showToast('Configuration discarded. Restored from database.', 'info');
  };

  const handleSave = async () => {
    try {
      const res = await superAdminAPI.updatePlatformConfig(config);
      if (res.ok) {
        showToast('Configuration seamlessly synchronized with active clusters.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('System execution failed. Changes not saved.', 'error');
    }
  };

  if (!config) {
    return <div className="min-h-screen bg-[#FDF9F1] flex items-center justify-center p-8">Loading Platform Configuration...</div>;
  }

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
                <VirtualExperience
                  data={config.virtualExperience}
                  onChange={(d: any) => setConfig({ ...config, virtualExperience: d })}
                />
              </div>
              {/* Row 1 Right - AI Sentiment (5/12) */}
              <div className="xl:col-span-5">
                <AISentiment
                  data={config.aiSentiment}
                  onChange={(d: any) => setConfig({ ...config, aiSentiment: d })}
                />
              </div>

              {/* Row 2 Left - Platform Security (7/12 or 6/12) */}
              <div className="xl:col-span-6">
                <PlatformSecurity
                  data={config.platformSecurity}
                  onChange={(d: any) => setConfig({ ...config, platformSecurity: d })}
                />
              </div>
              {/* Row 2 Right - Booking Rules (5/12 or 6/12) */}
              <div className="xl:col-span-6">
                <BookingRules
                  data={config.bookingRules}
                  onChange={(d: any) => setConfig({ ...config, bookingRules: d })}
                />
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

      {toast?.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-[#E0D8C3] max-w-sm w-full p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className={`p-4 rounded-full mb-5 ${toast.type === 'success' ? 'bg-[#FAF6EE] text-[#7C6A2E]' :
                toast.type === 'error' ? 'bg-[#FDF2F2] text-[#8C4A4A]' :
                  'bg-gray-100 text-gray-600'
              }`}>
              {toast.type === 'success' && <CheckCircle size={36} strokeWidth={2} />}
              {toast.type === 'error' && <AlertTriangle size={36} strokeWidth={2} />}
              {toast.type === 'info' && <Info size={36} strokeWidth={2} />}
            </div>

            <h3 className="font-serif font-bold text-2xl text-[#3D3000] mb-3">
              {toast.type === 'success' ? 'System Updated' : toast.type === 'error' ? 'Action Failed' : 'Notice'}
            </h3>

            <p className="text-sm font-medium text-gray-500 mb-8 px-2 leading-relaxed">
              {toast.message}
            </p>

            <button
              onClick={() => setToast(null)}
              className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-black/50 focus:ring-offset-2"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigMain;
