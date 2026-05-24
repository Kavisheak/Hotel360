import React from 'react';
import Image from 'next/image';
import { Compass } from 'lucide-react';

const VirtualTourSection = () => {
  return (
    <section className="relative w-full py-20 md:py-28 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/virtual_tour_bg.png"
          alt="Virtual Tour Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2a1a10]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto space-y-6">
        
        <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-bold">
          360° Experience
        </p>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight">
          Walk the aisle, before you walk it.
        </h2>

        <p className="text-gray-300 text-sm font-sans max-w-xl leading-relaxed">
          A cinematic, gyroscope-enabled tour of every room — from the arrival courtyard to the rooftop terrace.
        </p>

        <div className="pt-3">
          <button className="flex items-center gap-2 px-6 py-3 border border-[#c69c6d]/60 text-[#c69c6d] hover:bg-[#c69c6d] hover:text-black transition-colors duration-300 backdrop-blur-sm bg-black/20 text-[10px] tracking-widest uppercase font-semibold">
            <Compass size={14} strokeWidth={2} />
            Begin the tour
          </button>
        </div>

      </div>
    </section>
  );
};

export default VirtualTourSection;
