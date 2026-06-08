import React from 'react';
import { Check, X, PencilLine } from 'lucide-react';
import { Tier } from './packagesData';

interface TierCardProps {
  tier: Tier;
  onPriceChange: (id: string, val: number) => void;
}

// Visual identity per tier
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
  checkColor: string;
  featureIncluded: string;
  shadow: string;
  icon: string;
}> = {
  silver: {
    bg: 'bg-gradient-to-b from-white to-[#F8F7F5]',
    border: 'border-[#D0CAB8]',
    badgeBg: '',
    labelColor: 'text-gray-400',
    priceColor: 'text-[#4A4030]',
    guestColor: 'text-gray-400',
    divider: 'bg-[#E8E3D8]',
    inputBorder: 'border-[#D0CAB8]',
    inputFocus: 'focus:border-[#9A8A60]',
    inputBg: 'bg-white',
    checkColor: 'text-[#9A8A60]',
    featureIncluded: 'text-gray-700',
    shadow: 'hover:shadow-md',
    icon: '✦',
  },
  gold: {
    bg: 'bg-gradient-to-b from-[#FFFBF0] to-[#FFF7E0]',
    border: 'border-[#B08D2C]',
    badgeBg: 'bg-[#7C6A2E]',
    labelColor: 'text-[#7C6A2E]',
    priceColor: 'text-[#3D3000]',
    guestColor: 'text-[#A08040]',
    divider: 'bg-[#E0C868]/40',
    inputBorder: 'border-[#B08D2C]',
    inputFocus: 'focus:border-[#7C6A2E]',
    inputBg: 'bg-white',
    checkColor: 'text-[#B08D2C]',
    featureIncluded: 'text-[#3D3000] font-semibold',
    shadow: 'hover:shadow-[0_8px_30px_rgba(176,141,44,0.2)]',
    icon: '★',
  },
  diamond: {
    bg: 'bg-gradient-to-b from-[#1A1410] to-[#2C2218]',
    border: 'border-[#7C6A2E]',
    badgeBg: '',
    labelColor: 'text-[#B08D2C]',
    priceColor: 'text-white',
    guestColor: 'text-[#A09070]',
    divider: 'bg-[#B08D2C]/20',
    inputBorder: 'border-[#7C6A2E]',
    inputFocus: 'focus:border-[#B08D2C]',
    inputBg: 'bg-[#2C2218] text-[#F5E9C8]',
    checkColor: 'text-[#B08D2C]',
    featureIncluded: 'text-[#F5E9C8]',
    shadow: 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]',
    icon: '◆',
  },
};

const TierCard = ({ tier, onPriceChange }: TierCardProps) => {
  const theme = tierThemes[tier.id] ?? tierThemes.silver;
  const isDiamond = tier.id === 'diamond';

  return (
    <div
      className={`
        relative flex flex-col border-2 overflow-hidden
        transition-all duration-300 cursor-default
        ${theme.bg} ${theme.border} ${theme.shadow}
        ${tier.highlighted ? 'scale-[1.03] shadow-[0_4px_24px_rgba(176,141,44,0.25)] z-10' : ''}
      `}
    >
      {/* Decorative top accent line */}
      <div className={`h-1 w-full ${isDiamond ? 'bg-gradient-to-r from-[#B08D2C] via-[#E9C340] to-[#B08D2C]' : tier.highlighted ? 'bg-gradient-to-r from-[#B08D2C] to-[#E9C340]' : 'bg-[#D0CAB8]'}`} />

      {/* Most Popular Badge */}
      {tier.badge && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <span className="flex items-center gap-1.5 bg-[#7C6A2E] text-white text-[8px] font-bold tracking-[0.2em] uppercase px-5 py-2 shadow-md">
            <span className="text-yellow-300">★</span>
            {tier.badge}
            <span className="text-yellow-300">★</span>
          </span>
        </div>
      )}

      <div className={`flex flex-col flex-1 p-6 ${tier.badge ? 'pt-10' : ''}`}>
        {/* Tier Label + Icon + Edit */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-2">
            <span className={`text-base ${theme.checkColor}`}>{theme.icon}</span>
            <p className={`text-[9px] font-bold tracking-[0.22em] uppercase ${theme.labelColor}`}>
              {tier.label}
            </p>
          </div>
          <button
            className={`transition-colors ${isDiamond ? 'text-[#B08D2C] hover:text-[#E9C340]' : 'text-gray-400 hover:text-[#7C6A2E]'}`}
            title="Edit Tier"
          >
            <PencilLine size={13} />
          </button>
        </div>

        {/* Price */}
        <div className="mb-5">
          <p className={`text-5xl font-serif font-bold leading-none tracking-tight ${theme.priceColor}`}>
            ${tier.price.toLocaleString()}
          </p>
          <p className={`text-[10px] font-semibold mt-2 tracking-wide ${theme.guestColor}`}>
            Base Rate / {tier.guests} Guests
          </p>
        </div>

        {/* Divider */}
        <div className={`h-px w-full mb-5 ${theme.divider}`} />

        {/* Features */}
        <ul className="space-y-3 mb-6 flex-1">
          {tier.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5">
              {f.included ? (
                <span className={`flex items-center justify-center w-4 h-4 rounded-full border ${isDiamond ? 'border-[#B08D2C] bg-[#B08D2C]/20' : tier.highlighted ? 'border-[#B08D2C] bg-[#B08D2C]/10' : 'border-[#C0B090] bg-transparent'} shrink-0`}>
                  <Check size={9} className={theme.checkColor} strokeWidth={3} />
                </span>
              ) : (
                <span className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-200 bg-transparent shrink-0">
                  <X size={9} className="text-gray-300" strokeWidth={2.5} />
                </span>
              )}
              <span className={`text-sm leading-snug ${f.included ? theme.featureIncluded : (isDiamond ? 'text-[#6B5840]' : 'text-gray-400')}`}>
                {f.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Editable Price Input */}
        <input
          type="number"
          value={tier.price}
          onChange={e => onPriceChange(tier.id, Number(e.target.value))}
          className={`
            w-full border px-3 py-3 text-sm font-bold text-center
            focus:outline-none transition-colors
            ${theme.inputBorder} ${theme.inputFocus} ${theme.inputBg}
            ${isDiamond ? 'text-[#F5E9C8] placeholder-[#A09070]' : 'text-gray-700'}
          `}
        />
      </div>
    </div>
  );
};

export default TierCard;
