import React from 'react';
import { Info, Plus } from 'lucide-react';

const PackagePreview = () => {
  return (
    <div className="relative overflow-hidden border border-[#E0D8C3] shadow-sm aspect-[4/3] sm:aspect-video xl:aspect-[4/3]">
      <img
        src="/wedding_hall_preview.png"
        alt="Package Visual Preview"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
        <p className="font-serif italic text-[#F3EFE9] text-base leading-snug mb-1">
          "Excellence is in the details."
        </p>
        <p className="text-[9px] font-bold tracking-[0.25em] text-[#C5A040] uppercase">
          Package Visual Preview
        </p>
      </div>
    </div>
  );
};

const PriceLockReminder = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 flex gap-3 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Info size={13} className="text-blue-500 shrink-0" />
          <p className="text-[9px] font-bold tracking-[0.15em] text-blue-700 uppercase">Price Lock Reminder</p>
        </div>
        <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
          Adjusting these rates will affect all future quotes. Existing signed contracts will maintain their locked-in pricing structures.
        </p>
      </div>
      <button className="shrink-0 w-8 h-8 rounded-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white flex items-center justify-center transition-colors self-start shadow-sm">
        <Plus size={15} />
      </button>
    </div>
  );
};

export { PackagePreview, PriceLockReminder };
