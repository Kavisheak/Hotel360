import React from 'react';
import Image from 'next/image';
import { Phone, ArrowRight } from 'lucide-react';

const CTASection = () => {
 return (
 <section className="w-full bg-white dark:bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex justify-center section-reveal relative transition-colors duration-300">
 {/* Background Image Setup */}
 <div className="absolute inset-0 z-0">
 <Image
 src="/rings_bg.jpg"
 alt="Wedding Rings Background"
 fill
 className="object-cover opacity-20 hidden" // hidden by default, remove 'hidden' when rings_bg.jpg is added
 />
 <div className="absolute inset-0 bg-white/80 dark:bg-[#0A0A0A]/90 backdrop-blur-sm"></div>
 </div>
 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#805D3A]/30 to-transparent z-10"></div>
 
 <div className="max-w-4xl w-full flex flex-col items-center text-center z-10 relative">
 
 <div className="flex items-center justify-center gap-4 mb-6 text-reveal stagger-1">
 <div className="w-8 h-[1px] bg-[#C69C6D]/60 "></div>
 <p className="text-[#A6955C] text-[10px] tracking-[0.3em] uppercase font-bold">
 Next Steps
 </p>
 <div className="w-8 h-[1px] bg-[#C69C6D]/60 "></div>
 </div>

 <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C1E14] dark:text-white leading-tight mb-6 text-reveal stagger-2">
 Begin a <span className="italic text-[#C69C6D] font-light">conversation</span> with our curators.
 </h2>

 <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base font-light max-w-xl mb-12 text-reveal stagger-3">
 A brief consultation via phone or at our EASCC office in Batticaloa to understand your requirements and confirm availability.
 </p>

 <div className="flex flex-col sm:flex-row items-center gap-6 text-reveal stagger-4 z-10 relative">
 <a 
 href="tel:+94771234567"
 className="w-full sm:w-auto bg-[#C69C6D] text-white px-8 py-4 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:bg-[#B58B5C] :bg-[#B5953F] transition-all"
 >
 CALL +94 77 123 4567
 <Phone size={14} />
 </a>
 
 <a 
 href="/book"
 className="w-full sm:w-auto border border-[#E8DFC9] dark:border-[#C69C6D]/40 bg-white dark:bg-transparent text-[#C69C6D] px-8 py-4 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:bg-gray-50 dark:hover:bg-[#C69C6D]/10 transition-colors"
 >
 BOOK A CONSULTATION
 <ArrowRight size={14} />
 </a>
 </div>

 </div>
 </section>
 );
};

export default CTASection;
