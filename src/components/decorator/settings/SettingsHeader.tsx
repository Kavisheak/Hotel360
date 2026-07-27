import React from 'react';
import { User } from 'lucide-react';
import NotificationCenter from '@/components/notifications/NotificationCenter';

interface SettingsHeaderProps {
  onSave: () => void;
  isSaving?: boolean;
}

const SettingsHeader = ({ onSave, isSaving = false }: SettingsHeaderProps) => {
  return (
    <div className="mb-8 mt-4">
      {/* Top Mini-Header */}
      <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E]">
            <User size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800 tracking-wide">Decorator Portal</h4>
            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">PROFILE & PREFERENCES</p>
          </div>
        </div>
        <NotificationCenter role="decorator" />
      </div>

      {/* Main Header with Save Changes */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Settings
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed font-sans">
            Manage your decorator profile, update security credentials, and tailor your notification
            experiences for the Elite Wedding Hall network.
          </p>
        </div>

        {/* Save Changes Button */}
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center justify-center space-x-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-6 py-3 font-semibold text-xs tracking-widest transition-colors shadow-md shrink-0 self-start sm:mt-1 disabled:opacity-50"
        >
          <span>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsHeader;
