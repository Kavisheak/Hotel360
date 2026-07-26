import React from 'react';
import Image from 'next/image';
import { Compass } from 'lucide-react';

const VirtualTourSection = () => {
  return (
    <section className="w-full bg-[#F9F6F0] py-20 md:py-28 px-6 md:px-12 lg:px-20 flex items-center justify-center section-reveal">
      <div className="max-w-6xl w-full relative rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center py-32 px-6">
        
        {/* Cinematic Background Image Container */}
        <div className="absolute inset-0 z-0 border-2 border-[#C9A84C]/30">
          <Image
            src="/virtual_tour_bg.png"
            alt="Virtual Tour Background"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1A1512]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1512] via-transparent to-[#1A1512]/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl space-y-6">
          <div className="flex items-center gap-4 text-reveal stagger-1">
            <div className="w-8 h-[1px] bg-[#C9A84C]"></div>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase font-bold">
              360° Experience
            </p>
            <div className="w-8 h-[1px] bg-[#C9A84C]"></div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight text-reveal stagger-2">
            Walk the aisle, <span className="italic text-[#C9A84C] font-light">before you walk it.</span>
          </h2>

          <p className="text-gray-300 text-sm md:text-base font-light max-w-xl leading-relaxed text-reveal stagger-3">
            A cinematic, gyroscope-enabled tour of every room — from the grand arrival courtyard to the rooftop terrace.
          </p>

          <div className="pt-6 text-reveal stagger-4">
            <button className="btn-interactive pulse-glow flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 text-[11px] tracking-widest uppercase font-bold rounded-sm">
              <Compass size={16} strokeWidth={2} />
              Begin the tour
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTourSection;
