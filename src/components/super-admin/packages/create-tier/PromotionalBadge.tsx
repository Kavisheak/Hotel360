import React from 'react';

interface PromotionalBadgeProps {
  badge: string;
  setBadge: (val: string) => void;
}

const PromotionalBadge = ({ badge, setBadge }: PromotionalBadgeProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-serif font-bold text-gray-900 border-l-4 border-[#B08D2C] pl-3">
        Promotional Badge
      </h3>

      <div className="flex flex-col sm:flex-row gap-6">
        {['NONE', 'MOST POPULAR', 'LIMITED OFFER'].map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer text-xs font-bold tracking-widest select-none">
            <input
              type="radio"
              name="badge"
              value={option}
              checked={badge === option}
              onChange={() => setBadge(option)}
              className="accent-[#B08D2C] h-4 w-4"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PromotionalBadge;
