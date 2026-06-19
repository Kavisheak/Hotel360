import React from 'react';
import { MapPin } from 'lucide-react';

const EventTimeline = () => {
  return (
    <div className="bg-[#F2EBE1] border border-[#E0D8C3] flex flex-col">
      {/* Date Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-[#E0D8C3]">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight mb-1">
          December 12, 2026
        </h2>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
          3 SHOOTS SCHEDULED
        </p>
      </div>

      {/* Events */}
      <div className="flex-1 px-6 sm:px-8 py-6 relative">
        <div className="absolute left-[27px] sm:left-[35px] top-6 bottom-0 w-px bg-[#E0D8C3]" />

        <div className="space-y-6 relative">

          {/* Shoot 1 */}
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-[-6px] top-3.5 w-3 h-3 rounded-full bg-[#B08D2C] z-10 shrink-0" />

            <div className="bg-white border border-[#E0D8C3] p-4 sm:p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <span className="text-[11px] font-bold text-[#7C6A2E] tracking-wider">
                  08:00 AM – 01:00 PM
                </span>

                <span className="bg-[#EBE5D9] text-gray-600 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                  VENUE SETUP
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 font-serif">
                Sterling-Vance Wedding
              </h3>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed font-serif">
                Full venue walk-through, camera rigging, lighting checks, and ceremony run-through recording.
              </p>

              <div className="flex items-center space-x-1.5 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                <MapPin size={13} className="text-[#A6955C] shrink-0" />
                <span>ROSEWOOD ESTATE — GRAND HALL</span>
              </div>
            </div>
          </div>

          {/* Shoot 2 */}
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-[-6px] top-3.5 w-3 h-3 rounded-full bg-[#F3CE5A] border-2 border-[#F2EBE1] z-10 shrink-0" />

            <div className="bg-white border border-[#E0D8C3] p-4 sm:p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <span className="text-[11px] font-bold text-[#7C6A2E] tracking-wider">
                  02:00 PM – 06:00 PM
                </span>

                <span className="bg-[#FDF9F1] text-[#7C6A2E] border border-[#E0D8C3] px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                  CEREMONY COVERAGE
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 font-serif">
                Pre-Wedding & Ceremony
              </h3>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed font-serif">
                Bridal prep shots, ceremony coverage with 3 camera angles, drone aerial footage.
              </p>

              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
                      alt="Crew"
                    />
                  </div>

                  <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64"
                      alt="Crew"
                    />
                  </div>
                </div>

                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  +2 CAMERA CREW
                </span>
              </div>
            </div>
          </div>

          {/* Shoot 3 */}
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-[-6px] top-3.5 w-3 h-3 rounded-full bg-[#C4BCAB] border-2 border-[#F2EBE1] z-10 shrink-0" />

            <div className="border border-dashed border-[#C4BCAB] p-4 sm:p-5">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <span className="text-[11px] font-bold text-gray-500 tracking-wider">
                  07:00 PM
                </span>

                <span className="bg-[#E0D8C3] text-gray-600 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                  EQUIPMENT CHECK
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-600 mb-1.5 font-serif">
                Gear Inspection
              </h3>

              <p className="text-sm text-gray-500 italic font-serif leading-relaxed">
                Review camera bodies, lenses, drone batteries, memory cards, and backup systems before next day.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 sm:p-8 pt-4 border-t border-[#E0D8C3] flex space-x-3">
        <button className="flex-1 bg-[#EBE5D9] hover:bg-[#E0D8C3] text-gray-700 py-3 font-semibold text-xs tracking-[0.15em] transition-colors">
          VIEW ALL
        </button>

        <button className="flex-1 bg-[#685724] hover:bg-[#4A463B] text-white py-3 font-semibold text-xs tracking-[0.15em] transition-colors shadow-md">
          ADD SHOOT
        </button>
      </div>
    </div>
  );
};

export default EventTimeline;
