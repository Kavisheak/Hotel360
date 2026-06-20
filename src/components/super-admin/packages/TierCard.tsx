import React from 'react';
import { Check, X, PencilLine } from 'lucide-react';
import { Tier } from './packagesData';

interface TierCardProps {
  tier: Tier;
  index: number;
  onPriceChange: (id: string, val: number) => void;
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
    bg: 'bg-[#1C1613]',
    border: 'border-[#C5A040]',
    badgeBg: '',
    labelColor: 'text-[#C5A040]',
    priceColor: 'text-white',
    guestColor: 'text-[#9E9080]',
    divider: 'bg-[#C5A040]/30',
    inputBorder: 'border-[#3D342B]',
    inputFocus: 'focus:border-[#C5A040]',
    inputBg: 'bg-[#1C1613] text-[#F3EFE9]',
    checkBg: 'bg-transparent',
    checkBorder: 'border-[#C5A040]',
    checkIconColor: 'text-[#C5A040]',
    featureIncluded: 'text-[#F3EFE9]',
    featureExcluded: 'text-gray-600',
    shadow: 'hover:shadow-lg',
    icon: '◆',
  },
};

const TierCard = ({ tier, index, onPriceChange, onEdit }: TierCardProps) => {
  let themeKey = 'silver';
  if (tier.icon === 'crown') themeKey = 'gold';
  else if (tier.icon === 'diamond') themeKey = 'diamond';

  // Force dark theme if it's the middle card
  if (index === 1) {
    themeKey = 'diamond';
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
    <div
      className={`
        relative flex flex-col border-2 overflow-hidden
        transition-all duration-300 cursor-default p-6
        ${theme.bg} ${theme.border} ${theme.shadow}
        ${isMiddle ? 'py-10 scale-105 z-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border-[#C5A040]' : 'my-4 opacity-90 hover:opacity-100'}
        ${isHighlighted && !isMiddle ? 'pt-10 border-[#C5A040]' : ''}
      `}
    >
      {/* Promotional Badge */}
      {tier.badge && tier.badge !== 'NONE' && (
        <div className="absolute top-0 left-0 right-0">
          <div className="bg-[#7C6A2E] text-white text-[8px] font-bold tracking-[0.25em] uppercase py-2 text-center flex items-center justify-center gap-1.5 shadow-sm">
            <span>★</span>
            <span>{tier.badge}</span>
            <span>★</span>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <span className={`text-xs ${theme.labelColor}`}>{theme.icon}</span>
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${theme.labelColor}`}>
            {tier.label}
          </span>
        </div>
        <button onClick={onEdit} className="text-gray-400 hover:text-[#7C6A2E] transition-colors">
          <PencilLine size={14} className={isDiamond ? 'text-[#C5A040]/70 hover:text-[#C5A040]' : ''} />
        </button>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className={`text-5xl font-serif font-bold tracking-tight ${theme.priceColor}`}>
          ${(tier.price || 0).toLocaleString()}
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

      {/* Editable Price Box */}
      <div className="mt-auto">
        <input
          type="number"
          value={tier.price}
          onChange={(e) => onPriceChange(tier.id, Number(e.target.value))}
          className={`w-full border px-3 py-2 text-center text-xs font-bold font-mono focus:outline-none transition-colors ${theme.inputBorder} ${theme.inputBg} ${theme.inputFocus}`}
        />
      </div>
    </div>
  );
};

export default TierCard;
