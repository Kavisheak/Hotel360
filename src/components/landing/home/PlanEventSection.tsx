"use client";

import React from 'react';
import { Clock, Handshake, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';

const PlanEventSection = () => {
  const router = useRouter();

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/book');
  };

  const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 flex justify-center overflow-hidden border-t border-[#E8DFC9]">
      <div className="max-w-[1000px] w-full flex flex-col items-center text-center">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={slideUpVariants}
          className="flex flex-col items-center mobile-no-anim"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[1.5px] bg-[#C89E62]"></div>
            <p className="text-[#C89E62] text-[11px] tracking-[0.25em] uppercase font-bold">
              Plan Your Event
            </p>
            <div className="w-10 h-[1.5px] bg-[#C89E62]"></div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#2B4A3F] leading-[1.1] mb-6 font-medium">
            Let's Make Your <br/> Event Exceptional
          </h2>
          
          <p className="text-[#5A5A5A] text-[15px] leading-[1.8] mb-12 max-w-lg">
            Tell us about your event and we'll help you create an experience your guests will remember for years.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8DFC9] shadow-sm">
              <div className="w-12 h-12 rounded-full border border-[#EADDC4] flex items-center justify-center text-[#CDA566] bg-white shrink-0">
                <Clock strokeWidth={1.5} size={20} />
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[14px] font-bold text-[#2B4A3F] mb-1.5 tracking-wide">QUICK RESPONSE</h4>
                <p className="text-[13px] text-[#888888] max-w-[200px]">Our team will get back to you within 24 hours.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8DFC9] shadow-sm">
              <div className="w-12 h-12 rounded-full border border-[#EADDC4] flex items-center justify-center text-[#CDA566] bg-white shrink-0">
                <Handshake strokeWidth={1.5} size={20} />
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[14px] font-bold text-[#2B4A3F] mb-1.5 tracking-wide">CUSTOMIZED SOLUTIONS</h4>
                <p className="text-[13px] text-[#888888] max-w-[200px]">Tailored packages and professional support.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleBook}
            className="bg-[#CDA566] hover:bg-[#b8945b] text-white px-10 py-4 rounded-md flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest transition-all shadow-[0_4px_14px_rgba(205,165,102,0.4)]"
          >
            START BOOKING NOW
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PlanEventSection;
