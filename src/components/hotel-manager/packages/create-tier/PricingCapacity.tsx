import React from 'react';

interface PricingCapacityProps {
  baseRate: string;
  setBaseRate: (val: string) => void;
  minCapacity: string;
  setMinCapacity: (val: string) => void;
  maxCapacity: string;
  setMaxCapacity: (val: string) => void;
  guestSurcharge: string;
  setGuestSurcharge: (val: string) => void;
}

const PricingCapacity = ({
  baseRate,
  setBaseRate,
  minCapacity,
  setMinCapacity,
  maxCapacity,
  setMaxCapacity,
  guestSurcharge,
  setGuestSurcharge
}: PricingCapacityProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-serif font-bold text-gray-900 border-l-4 border-[#B08D2C] pl-3">
        Pricing &amp; Capacity
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Base Rate */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            Base Rate (PKR)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-800">Rs.</span>
            <input
              type="text"
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
              className="w-full border border-[#E0D8C3] pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#B08D2C] transition-colors font-mono font-bold"
            />
          </div>
        </div>

        {/* Min Capacity */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            Min Capacity
          </label>
          <input
            type="text"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            className="w-full border border-[#E0D8C3] px-4 py-3 text-xs focus:outline-none focus:border-[#B08D2C] transition-colors font-mono font-bold"
          />
        </div>

        {/* Max Capacity */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            Max Capacity
          </label>
          <input
            type="text"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(e.target.value)}
            className="w-full border border-[#E0D8C3] px-4 py-3 text-xs focus:outline-none focus:border-[#B08D2C] transition-colors font-mono font-bold"
          />
        </div>
      </div>

      {/* Surcharge */}
      <div>
        <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
          Additional Guest Surcharge (Per Head)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-800">Rs.</span>
          <input
            type="text"
            value={guestSurcharge}
            onChange={(e) => setGuestSurcharge(e.target.value)}
            className="w-full border border-[#E0D8C3] pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#B08D2C] transition-colors font-mono font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default PricingCapacity;
