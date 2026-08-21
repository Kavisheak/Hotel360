import { Lock, ArrowRight } from 'lucide-react';

const PackagePreview = () => {
  return (
    <div className="relative overflow-hidden border border-[#E0D8C3] shadow-sm aspect-[4/3] sm:aspect-video xl:aspect-[4/3]">
      <img
        src="/wedding_hall_preview.png"
        alt="Package Visual Preview"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
        <p className="font-serif italic text-white text-lg leading-snug mb-1">
          "Excellence is in the details."
        </p>
        <p className="text-[10px] text-gray-300 font-medium">
          Deliver unforgettable experiences.
        </p>
      </div>
    </div>
  );
};

const PriceLockReminder = () => {
  return (
    <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Lock size={14} className="text-blue-600" />
        <p className="text-[11px] font-bold text-blue-800">Price Lock Reminder</p>
      </div>
      <p className="text-[11px] text-blue-600/80 font-medium leading-relaxed">
        Adjusting these rates will affect future quotes. Existing signed contracts will maintain their locked-in pricing structures.
      </p>
      <button className="flex items-center justify-between w-full py-2.5 px-4 bg-blue-50/50 hover:bg-blue-100/50 border border-blue-100 rounded text-[10px] font-bold text-blue-800 transition-colors">
        View Affected Bookings <ArrowRight size={12} />
      </button>
    </div>
  );
};

export { PackagePreview, PriceLockReminder };
