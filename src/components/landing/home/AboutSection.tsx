"use client";

import React from 'react';
import Image from 'next/image';
import { Users, Building2, CalendarRange, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';

const AboutSection = () => {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 flex justify-center overflow-hidden border-t border-[#E8DFC9]">
      <motion.div 
        className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center mobile-no-anim"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        {/* Left Column - Image sliding from left */}
        <motion.div 
          variants={slideLeftVariants}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group bg-white"
        >
          <Image
            src="/eascc.png"
            alt="EASCCA Conference Center"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </motion.div>

        {/* Right Column - Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div variants={slideUpVariants} className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <div className="w-10 h-[1.5px] bg-[#C89E62]"></div>
            <p className="text-[#C89E62] text-[11px] tracking-[0.25em] uppercase font-bold">
              Welcome to EASCCA
            </p>
          </motion.div>
          
          <motion.h2 variants={slideUpVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-[#2B4A3F] mb-6 font-medium">
            A Space Designed for <br/> Exceptional Experiences.
          </motion.h2>
          
          <motion.p variants={slideUpVariants} className="text-[#5A5A5A] text-[15px] leading-relaxed mb-10 max-w-lg">
            EASCCA Conference Centre offers world-class facilities, modern amenities, and exceptional service for conferences, meetings, weddings, and a wide range of events. Create the perfect environment for your success.
          </motion.p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Users, count: '500+', label: 'Guest Capacity' },
              { icon: CalendarRange, count: '8+', label: 'Event Types' },
              { icon: Clock, count: '10+', label: 'Years of Service' },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={slideUpVariants} className="flex flex-col items-center md:items-start gap-3">
                <div className="w-12 h-12 rounded-full border border-[#EADDC4] flex items-center justify-center text-[#CDA566] bg-white shadow-sm">
                  <stat.icon size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl md:text-[1.75rem] font-serif text-[#2B4A3F] leading-none mb-1">{stat.count}</span>
                  <span className="text-[10px] text-[#888888] font-bold tracking-wider uppercase">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={slideUpVariants} className="flex justify-center md:justify-start w-full">
            <button 
              onClick={() => router.push('/about')}
              className="w-fit bg-[#CDA566] hover:bg-[#b8945b] text-white px-8 py-3.5 rounded-md flex items-center gap-2 text-[12px] tracking-wider font-bold transition-all shadow-[0_4px_14px_rgba(205,165,102,0.4)]"
            >
              LEARN MORE ABOUT US
              <ArrowRight className="w-3.5 h-3.5 ml-1 stroke-[3]" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
