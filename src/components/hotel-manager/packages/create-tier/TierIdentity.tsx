import React from 'react';
import { Diamond, Star, Award, Crown } from 'lucide-react';

interface TierIdentityProps {
  tierName: string;
  setTierName: (val: string) => void;
  selectedIcon: string;
  setSelectedIcon: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
}

export const getIconComponent = (icon: string, size = 20, className = "") => {
  switch (icon) {
    case 'diamond': return <Diamond size={size} className={className} />;
    case 'star': return <Star size={size} className={className} />;
    case 'award': return <Award size={size} className={className} />;
    case 'crown': return <Crown size={size} className={className} />;
    default: return <Diamond size={size} className={className} />;
  }
};

const TierIdentity = ({
  tierName,
  setTierName,
  selectedIcon,
  setSelectedIcon,
  description,
  setDescription
}: TierIdentityProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-serif font-bold text-gray-900 border-l-4 border-[#B08D2C] pl-3">
        Tier Identity
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tier Name */}
        <div className="md:col-span-6">
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            Tier Name
          </label>
          <input
            type="text"
            placeholder="e.g., Platinum Elite"
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
            className="w-full border border-[#E0D8C3] px-4 py-3 text-xs focus:outline-none focus:border-[#B08D2C] transition-colors"
          />
        </div>

        {/* Icon Selector */}
        <div className="md:col-span-4">
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            Tier Icon
          </label>
          <div className="flex gap-2">
            {['diamond', 'star', 'award', 'crown'].map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={`p-2.5 border transition-all ${
                  selectedIcon === icon
                    ? 'border-[#B08D2C] bg-[#B08D2C]/10 text-[#7C6A2E]'
                    : 'border-[#E0D8C3] bg-transparent text-gray-400 hover:text-[#7C6A2E]'
                }`}
              >
                {getIconComponent(icon, 16)}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div className="md:col-span-2">
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            Color
          </label>
          <div className="w-10 h-10 bg-[#B08D2C] border border-[#7C6A2E] shadow-sm cursor-pointer" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Describe the exclusivity of this tier..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-[#E0D8C3] px-4 py-3 text-xs focus:outline-none focus:border-[#B08D2C] transition-colors resize-none font-serif"
        />
      </div>
    </div>
  );
};

export default TierIdentity;
