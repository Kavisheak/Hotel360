import React from 'react';
import Image from 'next/image';
import { Compass } from 'lucide-react';

const VirtualTourSection = () => {
  return (
    <section className="relative w-full py-32 md:py-48 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/virtual_tour_bg.png"
          alt="Virtual Tour Background"
          fill
          className="object-cover object-center"
        />
        {/* Dark warm overlay to match the image's mood and make text legible */}
        <div className="absolute inset-0 bg-[#2a1a10]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto space-y-8">
        
        {/* Top small label */}
        <p className="text-[#c69c6d] text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold">
          360° Experience
        </p>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-tight">
          Walk the aisle, before you walk it.
        </h2>

        {/* Paragraph */}
        <p className="text-gray-300 text-sm md:text-base font-sans max-w-2xl leading-relaxed">
          A cinematic, gyroscope-enabled tour of every room — from the arrival courtyard to the rooftop terrace.
        </p>

        {/* Button */}
        <div className="pt-6">
          <button className="flex items-center gap-3 px-8 py-4 border border-[#c69c6d]/60 text-[#c69c6d] hover:bg-[#c69c6d] hover:text-black transition-colors duration-300 backdrop-blur-sm bg-black/20 text-xs tracking-widest uppercase font-semibold">
            <Compass size={16} strokeWidth={2} />
            Begin the tour
          </button>
        </div>

      </div>
    </section>
  );
};

export default VirtualTourSection;
