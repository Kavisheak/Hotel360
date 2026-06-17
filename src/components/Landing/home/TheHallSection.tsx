import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const TheHallSection = () => {
  return (
    <section className="w-full bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex justify-center section-reveal">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Column - Image */}
        <div className="relative w-full aspect-[3/4] max-h-[600px] overflow-hidden group">
          <Image
            src="/luxury_ballroom_bg.png"
            alt="Table setting"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80"></div>
          
          <button className="absolute bottom-6 right-6 border border-[#C9A84C]/50 bg-black/40 backdrop-blur-md text-[#C9A84C] px-6 py-3 flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[#C9A84C]/20 transition-all">
            View Gallery
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6 text-reveal stagger-1">
            <div className="w-10 h-[1px] bg-[#C9A84C]/60"></div>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase font-bold">
              The Venue
            </p>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-white mb-8 text-reveal stagger-2">
            A sanctuary held <span className="italic text-[#C9A84C] font-light">safely above.</span>
          </h2>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg font-light mb-12 text-reveal stagger-3">
            The venue encompasses the entire upper floor of the complex, ensuring absolute privacy for your celebration. Our space is meticulously designed to elevate the standard of hospitality in Batticaloa.
          </p>

          <div className="flex flex-col gap-8 text-reveal stagger-4">
            <div className="flex flex-col pl-6 border-l border-[#C9A84C]/30 relative">
              <div className="absolute top-0 left-[-1px] w-[2px] h-1/3 bg-[#C9A84C]"></div>
              <h4 className="text-white font-serif text-lg mb-2">Pillarless Grandeur</h4>
              <p className="text-gray-500 text-sm font-light leading-relaxed">Unobstructed sightlines from every corner of the room.</p>
            </div>

            <div className="flex flex-col pl-6 border-l border-[#C9A84C]/30 relative">
              <div className="absolute top-0 left-[-1px] w-[2px] h-1/3 bg-[#C9A84C]"></div>
              <h4 className="text-white font-serif text-lg mb-2">Acoustic Precision</h4>
              <p className="text-gray-500 text-sm font-light leading-relaxed">Sound-engineered walls for perfect musical resonance.</p>
            </div>

            <div className="flex flex-col pl-6 border-l border-[#C9A84C]/30 relative">
              <div className="absolute top-0 left-[-1px] w-[2px] h-1/3 bg-[#C9A84C]"></div>
              <h4 className="text-white font-serif text-lg mb-2">Bespoke Customization</h4>
              <p className="text-gray-500 text-sm font-light leading-relaxed">A blank canvas to bring your exact vision to life.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TheHallSection;
