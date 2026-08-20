import React from 'react';
import { Check, X, PencilLine } from 'lucide-react';
import { Tier } from './packagesData';

interface TierCardProps {
  tier: Tier;
  index: number;
  onEdit: () => void;
}

const tierThemes: Record<string, {
  bg: string;
  border: string;
  badgeBg: string;
  labelColor: string;
  priceColor: string;
  guestColor: string;
  divider: string;
  inputBorder: string;
  inputFocus: string;
  inputBg: string;
  checkBg: string;
  checkBorder: string;
  checkIconColor: string;
  featureIncluded: string;
  featureExcluded: string;
  shadow: string;
  icon: string;
}> = {
  silver: {
    bg: 'bg-white',
    border: 'border-[#E5DFD1]',
    badgeBg: '',
    labelColor: 'text-[#9C9380]',
    priceColor: 'text-[#3D341D]',
    guestColor: 'text-[#9C9380]',
    divider: 'bg-[#E5DFD1]/50',
    inputBorder: 'border-[#E5DFD1]',
    inputFocus: 'focus:border-[#B08D2C]',
    inputBg: 'bg-white text-gray-800',
    checkBg: 'bg-transparent',
    checkBorder: 'border-[#B08D2C]',
    checkIconColor: 'text-[#B08D2C]',
    featureIncluded: 'text-gray-700',
    featureExcluded: 'text-gray-300 line-through',
    shadow: 'hover:shadow-md',
    icon: '✦',
  },
  gold: {
    bg: 'bg-[#FFFDF6]',
    border: 'border-[#C5A040]',
    badgeBg: 'bg-[#7C6A2E]',
    labelColor: 'text-[#7C6A2E]',
    priceColor: 'text-[#3D341D]',
    guestColor: 'text-[#A08848]',
    divider: 'bg-[#E5DFD1]/50',
    inputBorder: 'border-[#C5A040]',
    inputFocus: 'focus:border-[#7C6A2E]',
    inputBg: 'bg-white text-gray-800',
    checkBg: 'bg-[#FFFDF6]',
    checkBorder: 'border-[#C5A040]',
    checkIconColor: 'text-[#C5A040]',
    featureIncluded: 'text-gray-900 font-semibold',
    featureExcluded: 'text-gray-300',
    shadow: 'shadow-[0_4px_20px_rgba(197,160,64,0.15)]',
    icon: '★',
  },
  diamond: {
    bg: 'bg-white',
    border: 'border-[#E5DFD1]',
    badgeBg: '',
    labelColor: 'text-[#9C9380]',
    priceColor: 'text-[#3D341D]',
    guestColor: 'text-[#9C9380]',
    divider: 'bg-[#E5DFD1]/50',
    inputBorder: 'border-[#E5DFD1]',
    inputFocus: 'focus:border-[#B08D2C]',
    inputBg: 'bg-white text-gray-800',
    checkBg: 'bg-transparent',
    checkBorder: 'border-[#B08D2C]',
    checkIconColor: 'text-[#B08D2C]',
    featureIncluded: 'text-gray-700',
    featureExcluded: 'text-gray-300 line-through',
    shadow: 'shadow-sm',
    icon: '◆',
  },
};

const TierCard = ({ tier, index, onEdit }: TierCardProps) => {
  let themeKey = 'silver';
  if (tier.icon === 'crown') themeKey = 'gold';
  else if (tier.icon === 'diamond') themeKey = 'diamond';

  // Force Gold theme for middle card
  if (index === 1) {
    themeKey = 'gold';
  }

  // Fallbacks based on label if icon is missing
  if (!tier.icon && index !== 1) {
    const labelLower = tier.label.toLowerCase();
    if (labelLower.includes('gold') || labelLower.includes('royal')) themeKey = 'gold';
    else if (labelLower.includes('diamond') || labelLower.includes('platinum')) themeKey = 'diamond';
  }

  const theme = tierThemes[themeKey];
  const isGold = themeKey === 'gold';
  const isDiamond = themeKey === 'diamond';

  const isHighlighted = tier.badge === 'MOST POPULAR';
  const isMiddle = index === 1;

  return (
    <div className={`relative mt-4 flex flex-col ${theme.bg}`}>
      
      <div
        className={`
          flex-1 flex flex-col border overflow-hidden
          transition-all duration-300 p-8 rounded-md
          ${theme.border} ${theme.shadow}
          ${isGold ? 'border-2 border-[#C5A040] shadow-[0_8px_30px_rgba(197,160,64,0.15)]' : 'border-[#E5DFD1] hover:shadow-md'}
        `}
      >

      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <span className={`text-xs ${theme.labelColor}`}>{theme.icon}</span>
          <span className={`text-[12px] font-bold tracking-[0.2em] uppercase ${theme.labelColor}`}>
            {tier.label}
          </span>
        </div>
        <button onClick={onEdit} className="text-gray-400 hover:text-[#7C6A2E] transition-colors">
          <PencilLine size={16} />
        </button>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className={`text-5xl font-serif font-bold tracking-tight ${theme.priceColor}`}>
          RS {(tier.price || 0).toLocaleString()}
        </div>
        <div className={`text-[10px] mt-1 font-serif ${theme.guestColor}`}>
          Base Rate / {tier.guests} Guests
        </div>
      </div>

      {/* Divider */}
      <div className={`h-px w-full mb-6 ${theme.divider}`} />

      {/* Features List */}
      <ul className="space-y-4 mb-8 flex-1">
        {tier.features.map((f, idx) => (
          <li key={idx} className="flex items-center gap-3">
            {f.included ? (
              <span className={`w-4 h-4 rounded-full border ${theme.checkBorder} ${theme.checkBg} flex items-center justify-center shrink-0`}>
                <Check size={10} className={theme.checkIconColor} strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-200 bg-transparent flex items-center justify-center shrink-0">
                <X size={10} className="text-gray-300" strokeWidth={2.5} />
              </span>
            )}
            <span className={`text-xs ${f.included ? theme.featureIncluded : 'text-gray-400'}`}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Edit Button */}
      <div className="mt-8">
        <button
          onClick={onEdit}
          className={`w-full py-3.5 text-xs font-bold uppercase tracking-widest transition-colors rounded ${
            isGold 
              ? 'bg-[#C5A040] hover:bg-[#B08D2C] text-white shadow-sm' 
              : 'bg-white hover:bg-[#FAF6EE] text-[#7C6A2E] border border-[#E5DFD1]'
          }`}
        >
          Edit Package
        </button>
      </div>
    </div>
    </div>
  );
};

export default TierCard;
