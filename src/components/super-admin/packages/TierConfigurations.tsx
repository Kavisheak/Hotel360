import React from 'react';
import { Plus } from 'lucide-react';
import { Tier } from './packagesData';
import TierCard from './TierCard';

interface TierConfigurationsProps {
  tiers: Tier[];
  onPriceChange: (id: string, val: number) => void;
}

const TierConfigurations = ({ tiers, onPriceChange }: TierConfigurationsProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-10">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <span className="text-[#B08D2C] text-xl">⊞</span>
            Hall Tier Configurations
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1 ml-8">
            Configure base rates and inclusions for each service tier
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase hover:text-[#B08D2C] transition-colors border border-[#E0D8C3] hover:border-[#B08D2C] px-4 py-2">
          <Plus size={12} />
          ADD NEW TIER
        </button>
      </div>

      {/* Three Tier Cards — Gold is elevated */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-5 items-start">
        {tiers.map(tier => (
          <TierCard key={tier.id} tier={tier} onPriceChange={onPriceChange} />
        ))}
      </div>

      {/* Bottom caption */}
      <p className="text-center text-[9px] font-semibold text-gray-400 tracking-widest uppercase mt-8">
        All prices are base rates · Subject to seasonal adjustments · VAT/GST applicable
      </p>
    </div>
  );
};

export default TierConfigurations;
