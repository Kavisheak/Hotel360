import React from 'react';
import { Info, Plus } from 'lucide-react';

const PackagePreview = () => {
  return (
    <div className="relative overflow-hidden border border-[#E0D8C3]">
      <img
        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
        alt="Package Visual Preview"
        className="w-full h-44 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
        <p className="font-serif italic text-white text-sm leading-snug mb-1">
          "Excellence is in the details."
        </p>
        <p className="text-[9px] font-bold tracking-[0.2em] text-yellow-300 uppercase">
          Package Visual Preview
        </p>
      </div>
    </div>
  );
};

const PriceLockReminder = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 flex gap-3">
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
