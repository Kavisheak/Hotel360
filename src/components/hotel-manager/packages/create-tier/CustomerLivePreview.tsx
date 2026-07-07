import React from 'react';
import { Eye, Check, X } from 'lucide-react';
import Link from 'next/link';
import { getIconComponent } from './TierIdentity';

interface InclusionsState {
  valet: boolean;
  bridal: boolean;
  led: boolean;
  catering: boolean;
}

interface CustomerLivePreviewProps {
  tierName: string;
  selectedIcon: string;
  description: string;
  baseRate: string;
  features: string[];
  inclusions: InclusionsState;
  badge: string;
  onSave: () => void;
  isSubmitting?: boolean;
}

const CustomerLivePreview = ({
  tierName,
  selectedIcon,
  description,
  baseRate,
  features,
  inclusions,
  badge,
  onSave,
  isSubmitting
}: CustomerLivePreviewProps) => {
  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className="bg-white border border-[#E0D8C3] shadow-sm relative overflow-hidden flex flex-col justify-between p-6">
        {/* Live Preview Header Indicator */}
        <div className="flex justify-between items-center bg-[#4E411B] text-white text-[8px] font-bold tracking-[0.25em] uppercase py-2 px-4 -mx-6 -mt-6 mb-8">
          <span>Customer Live Preview</span>
          <Eye size={12} className="text-[#C5A040]" />
        </div>

        {/* Banner */}
        {badge !== 'NONE' && (
          <div className="absolute top-8 right-0 bg-[#7C6A2E] text-white text-[7px] font-bold tracking-widest uppercase px-3 py-1 shadow-sm">
            {badge}
          </div>
        )}

        <div className="flex flex-col items-center text-center mt-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#B08D2C] mb-6 shadow-inner">
            {getIconComponent(selectedIcon, 24, "stroke-[1.5]")}
          </div>

          {/* Name */}
          <h4 className="text-3xl font-serif font-bold text-[#7C6A2E] tracking-tight uppercase max-w-[200px] leading-tight">
            {tierName || 'Tier Name'}
          </h4>

          {/* Description */}
          <p className="text-xs text-gray-500 italic font-serif mt-3 max-w-[220px] leading-relaxed">
            "{description || 'No description provided.'}"
          </p>

          {/* Pricing */}
          <div className="mt-8 mb-6">
            <p className="text-sm font-serif text-[#A08848] tracking-widest uppercase font-bold leading-none mb-1">
              Rs.
            </p>
            <p className="text-4xl font-serif font-bold text-gray-900 leading-none">
              {baseRate || '0.00'}
            </p>
            <p className="text-[8px] font-bold tracking-wider text-gray-400 uppercase mt-2">
              Base Rate Per Event
            </p>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-8 px-2">
          {/* Dynamic tags inclusions */}
          {features.map((feat) => (
            <li key={feat} className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full border border-[#C5A040] bg-[#FFFDF6] flex items-center justify-center shrink-0">
                <Check size={9} className="text-[#C5A040]" strokeWidth={3} />
              </span>
              <span className="text-xs text-gray-800 font-semibold">{feat}</span>
            </li>
          ))}

          {/* Checkboxes Inclusions */}
          <li className="flex items-center gap-3">
            {inclusions.valet ? (
              <span className="w-4 h-4 rounded-full border border-[#C5A040] bg-[#FFFDF6] flex items-center justify-center shrink-0">
                <Check size={9} className="text-[#C5A040]" strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-200 bg-transparent flex items-center justify-center shrink-0">
                <X size={9} className="text-gray-300" strokeWidth={2.5} />
              </span>
            )}
            <span className={`text-xs ${inclusions.valet ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>
              Valet Parking
            </span>
          </li>
          <li className="flex items-center gap-3">
            {inclusions.bridal ? (
              <span className="w-4 h-4 rounded-full border border-[#C5A040] bg-[#FFFDF6] flex items-center justify-center shrink-0">
                <Check size={9} className="text-[#C5A040]" strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-200 bg-transparent flex items-center justify-center shrink-0">
                <X size={9} className="text-gray-300" strokeWidth={2.5} />
              </span>
            )}
            <span className={`text-xs ${inclusions.bridal ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>
              Bridal Suite
            </span>
          </li>
          <li className="flex items-center gap-3">
            {inclusions.led ? (
              <span className="w-4 h-4 rounded-full border border-[#C5A040] bg-[#FFFDF6] flex items-center justify-center shrink-0">
                <Check size={9} className="text-[#C5A040]" strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-200 bg-transparent flex items-center justify-center shrink-0">
                <X size={9} className="text-gray-300" strokeWidth={2.5} />
              </span>
            )}
            <span className={`text-xs ${inclusions.led ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>
              LED Screen (20x10)
            </span>
          </li>
          <li className="flex items-center gap-3">
            {inclusions.catering ? (
              <span className="w-4 h-4 rounded-full border border-[#C5A040] bg-[#FFFDF6] flex items-center justify-center shrink-0">
                <Check size={9} className="text-[#C5A040]" strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-200 bg-transparent flex items-center justify-center shrink-0">
                <X size={9} className="text-gray-300" strokeWidth={2.5} />
              </span>
            )}
            <span className={`text-xs ${inclusions.catering ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>
              Gourmet Catering
            </span>
          </li>
        </ul>

        {/* Select Tier Button */}
        <button className="w-full border border-[#C5A040] hover:bg-[#FAF6EE] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase py-3 transition-colors mt-4">
          Select This Tier
        </button>
      </div>

      {/* Action Buttons */}
      <div className="bg-[#FFFDF6] border border-[#E0D8C3] p-5 space-y-4">
        <button
          onClick={onSave}
          disabled={isSubmitting}
          className="w-full bg-[#B08D2C] hover:bg-[#9B7A20] disabled:bg-gray-400 text-white font-bold text-xs tracking-widest uppercase py-3.5 transition-colors shadow-sm"
        >
          {isSubmitting ? 'Saving...' : 'Save New Tier'}
        </button>
        <Link
          href="/hotel-manager/packages"
          className="w-full border border-gray-850 hover:bg-gray-50 text-gray-800 font-bold text-xs tracking-widest uppercase py-3.5 transition-colors block text-center"
        >
          Cancel Configuration
        </Link>
        <p className="text-[8px] text-gray-400 leading-relaxed text-center mt-2">
          All tier updates are pushed live to the booking portal immediately upon saving.
        </p>
      </div>
    </div>
  );
};

export default CustomerLivePreview;
