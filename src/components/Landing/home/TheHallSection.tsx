import React from 'react';
import Image from 'next/image';
import { ArrowRight, Crown, Volume2, Palette } from 'lucide-react';

const TheHallSection = () => {
 return (
 <section className="w-full bg-white dark:bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex justify-center section-reveal transition-colors duration-300">
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
 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80"></div>
 
 {/* View Gallery Button overlaying image */}
 <button className="absolute bottom-6 right-6 border border-[#E8DFC9] dark:border-[#C69C6D]/30 bg-white dark:bg-[#111111]/80 text-[#C69C6D] px-6 py-3 flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-gray-50 dark:hover:bg-[#111111] transition-all shadow-sm">
 View Gallery
 <ArrowRight size={14} />
 </button>
 </div>

 {/* Right Column - Content */}
 <div className="flex flex-col">
 <div className="flex items-center gap-4 mb-6 text-reveal stagger-1">
 <div className="w-10 h-[1px] bg-[#C69C6D]/60 "></div>
 <p className="text-[#A6955C] text-[10px] tracking-[0.3em] uppercase font-bold">
 The Venue
 </p>
 </div>
 
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-[#2C1E14] dark:text-white mb-8 text-reveal stagger-2">
 A sanctuary held <span className="italic text-[#805D3A] font-light">safely above.</span>
 </h2>

 <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-lg font-light mb-12 text-reveal stagger-3">
 The venue encompasses the entire upper floor of the complex, ensuring absolute privacy for your celebration. Our space is meticulously designed to elevate the standard of hospitality in Batticaloa.
 </p>

 <div className="flex flex-col gap-8 text-reveal stagger-4">
 <div className="flex items-start gap-4 relative">
 <div className="text-[#C69C6D] mt-1 shrink-0"><Crown size={20} strokeWidth={1.5} /></div>
 <div className="flex flex-col">
 <h4 className="text-[#2C1E14] dark:text-white font-serif text-lg mb-1">Pillarless Grandeur</h4>
 <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">Unobstructed sightlines from every corner of the room.</p>
 </div>
 </div>

 <div className="flex items-start gap-4 relative">
 <div className="text-[#C69C6D] mt-1 shrink-0"><Volume2 size={20} strokeWidth={1.5} /></div>
 <div className="flex flex-col">
 <h4 className="text-[#2C1E14] dark:text-white font-serif text-lg mb-1">Acoustic Precision</h4>
 <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">Sound-engineered walls for perfect musical resonance.</p>
 </div>
 </div>

 <div className="flex items-start gap-4 relative">
 <div className="text-[#C69C6D] mt-1 shrink-0"><Palette size={20} strokeWidth={1.5} /></div>
 <div className="flex flex-col">
 <h4 className="text-[#2C1E14] dark:text-white font-serif text-lg mb-1">Bespoke Customization</h4>
 <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">A blank canvas to bring your exact vision to life.</p>
 </div>
 </div>
 </div>
 </div>

 </div>
 </section>
 );
};

export default TheHallSection;
