import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="w-full bg-white dark:bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex justify-center section-reveal relative transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#805D3A]/30 dark:via-[#C9A84C]/30 to-transparent"></div>
      
      <div className="max-w-4xl w-full flex flex-col items-center text-center">
        
        <div className="flex items-center justify-center gap-4 mb-6 text-reveal stagger-1">
          <div className="w-8 h-[1px] bg-[#C9A84C]/60"></div>
          <p className="text-[#805D3A] dark:text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase font-bold">
            Next Steps
          </p>
          <div className="w-8 h-[1px] bg-[#C9A84C]/60"></div>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C1E14] dark:text-white leading-tight mb-6 text-reveal stagger-2">
          Begin a <span className="italic text-[#805D3A] dark:text-[#C9A84C] font-light">conversation</span> with our curators.
        </h2>

        <p className="text-gray-700 dark:text-gray-400 text-sm md:text-base font-light max-w-xl mb-12 text-reveal stagger-3">
          A brief consultation via phone or at our EASCC office in Batticaloa to understand your requirements and confirm availability.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 text-reveal stagger-4">
          <a 
            href="tel:+94770000000"
            className="w-full sm:w-auto bg-[#D4AF37] dark:bg-[#C9A84C] text-black px-8 py-4 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:bg-[#C9A84C] dark:hover:bg-[#B5953F] transition-all"
          >
            Call +94 77 000 0000
            <Phone size={14} />
          </a>
          
          <a 
            href="/book"
            className="w-full sm:w-auto border border-[#C9A84C]/50 bg-white dark:bg-transparent text-[#805D3A] dark:text-[#C9A84C] px-8 py-4 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:bg-gray-50 dark:hover:bg-[#C9A84C]/10 transition-colors"
          >
            Book a Consultation
            <ArrowRight size={14} />
          </a>
        </div>

      </div>
    </section>
  );
};

export default CTASection;
