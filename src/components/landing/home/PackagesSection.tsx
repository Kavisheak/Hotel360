import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Users, ArrowRight } from 'lucide-react';

const PackagesSection = () => {
 const scrollContainerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
   if (window.innerWidth < 768 && scrollContainerRef.current) {
     setTimeout(() => {
       const container = scrollContainerRef.current;
       if (container) {
         const cardWidth = window.innerWidth * 0.75; // 75vw
         const gap = 24; // gap-6 is 1.5rem = 24px
         const scrollPos = 24 + cardWidth + gap - ((window.innerWidth - cardWidth) / 2);
         container.scrollTo({ left: scrollPos, behavior: 'smooth' });
       }
     }, 300);
   }
 }, []);

 const packages = [
 {
 id: 'silver',
 name: 'Silver Package',
 price: 'LKR 1.8M',
 guests: 'Up to 250 guests',
 description: 'An intimate ceremony of refined essentials.',
 image: '/silver_package.png',
 isMostLoved: false,
 },
 {
 id: 'gold',
 name: 'Gold Package',
 price: 'LKR 3.4M',
 guests: 'Up to 380 guests',
 description: 'Our most chosen — celebrated for its balance.',
 image: '/gold_package.png',
 isMostLoved: true,
 },
 {
 id: 'diamond',
 name: 'Diamond Package',
 price: 'LKR 5.9M',
 guests: 'Up to 480 guests',
 description: 'A no-restraint affair — the venue, entirely yours.',
 image: '/diamond_package.png',
 isMostLoved: false,
 },
 ];

 return (
 <section className="w-full bg-white dark:bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-center section-reveal relative transition-colors duration-300">
 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#805D3A]/30 to-transparent"></div>
 
 {/* Header Section */}
 <div className="text-center mb-20 space-y-4 relative z-10">
 <p className="text-[#805D3A] text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">
 Bespoke Offerings
 </p>
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C1E14] dark:text-white leading-tight text-reveal stagger-2">
 Three suites of <span className="italic text-[#805D3A] font-light">celebration.</span>
 </h2>
 <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base font-light max-w-xl mx-auto pt-2 text-reveal stagger-3">
 Each tier is thoughtfully composed to balance grand vision with precise execution. Compare our signature collections below.
 </p>
 </div>

 {/* Cards Grid */}
 <div ref={scrollContainerRef} className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-6 max-w-6xl w-[100vw] sm:w-full -ml-6 md:ml-0 md:w-full items-center relative z-10 pb-12 md:pb-0 px-6 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 {packages.map((pkg, index) => (
 <div 
 key={pkg.id}
 className={`flex flex-col overflow-hidden transition-all duration-500 relative card-entrance stagger-${index + 1} min-w-[75vw] sm:min-w-[60vw] md:min-w-0 snap-center shrink-0 ${
 pkg.isMostLoved 
 ? 'bg-white dark:bg-transparent border border-[#C69C6D] shadow-lg md:-translate-y-4 md:scale-105 z-20 py-6 px-4 md:py-10 md:px-8' 
 : 'bg-white dark:bg-transparent border border-[#E8DFC9] dark:border-[#C69C6D]/30 hover:border-[#C69C6D]/60 dark:hover:border-[#C69C6D]/80 z-10 py-4 px-4 md:py-8 md:px-6'
 }`}
 >

 {/* Card Content */}
 <div className="flex flex-col flex-grow text-center">
 <h3 className="text-[#A6955C] font-serif text-lg md:text-2xl mb-4 mt-2">
 {pkg.name}
 </h3>
 
 <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
 <div className="w-6 h-[1px] bg-[#C69C6D]"></div>
 <div className="w-1.5 h-1.5 rotate-45 bg-[#C69C6D]"></div>
 <div className="w-6 h-[1px] bg-[#C69C6D]"></div>
 </div>
 
 <div className="mb-6">
 <h4 className="text-3xl md:text-5xl font-serif text-[#2C1E14] dark:text-white mb-2 tracking-tight">
 {pkg.price}
 </h4>
 </div>

 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-light mb-8 pb-8 border-b border-[#D4C9A8] dark:border-white/10 ">
 {pkg.description}
 </p>

 <div className="flex flex-col gap-4 text-center md:text-left mb-8 flex-grow items-center md:items-start">
 {['Dedicated Wedding Planner', 'Exclusive Ballroom Access', 'Complimentary Tasting Menu', 'Valet Parking for Guests'].map((feature, i) => (
 <div key={i} className="flex items-center md:items-start gap-3">
 <div className="mt-1 md:mt-1.5 w-1 h-1 rotate-45 bg-[#C69C6D] flex-shrink-0"></div>
 <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm font-light">{feature}</span>
 </div>
 ))}
 </div>

 {/* Action Button */}
 <a 
 href="/customer/packages"
 className={`w-full py-3.5 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-bold transition-all duration-300 ${
 pkg.isMostLoved 
 ? 'bg-[#C69C6D] dark:bg-transparent dark:border dark:border-[#C69C6D] text-white hover:bg-[#B58B5C] dark:hover:bg-[#C69C6D]/20'
 : 'bg-white dark:bg-transparent border border-[#E8DFC9] dark:border-[#C69C6D]/40 text-[#C69C6D] hover:bg-gray-50 dark:hover:bg-[#C69C6D]/10'
 }`}
 >
 SELECT PACKAGE
 <ArrowRight size={14} />
 </a>
 </div>
 </div>
 ))}
 </div>

 </section>
 );
};

export default PackagesSection;
