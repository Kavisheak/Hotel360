"use client";

import React from 'react';
import { Users, Briefcase, GraduationCap, PenTool, Lightbulb, Heart, GlassWater, Presentation } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const EventsWeHostSection = () => {
  const events = [
    { name: 'Conferences', icon: Users },
    { name: 'Corporate Meetings', icon: Briefcase },
    { name: 'Seminars', icon: GraduationCap },
    { name: 'Workshops', icon: PenTool },
    { name: 'Training Programs', icon: Lightbulb },
    { name: 'Weddings & Receptions', icon: Heart },
    { name: 'Private Functions', icon: GlassWater },
    { name: 'Exhibitions / Special Events', icon: Presentation },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col items-center border-t border-[#E8DFC9] overflow-hidden">
      <motion.div 
        className="max-w-[1400px] w-full flex flex-col items-center mobile-no-anim"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div variants={slideUpVariants} className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1.5px] bg-[#C89E62]"></div>
            <p className="text-[#C89E62] text-[11px] tracking-[0.25em] uppercase font-bold">
              Events We Host
            </p>
            <div className="w-8 h-[1.5px] bg-[#C89E62]"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#2B4A3F] leading-[1.1] font-medium">
            Perfect for Every Occasion
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6 lg:gap-4 w-full"
          variants={containerVariants}
        >
          {events.map((event, idx) => {
            const Icon = event.icon;
            return (
              <motion.div 
                key={idx} 
                variants={slideLeftVariants}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#EADDC4] bg-white flex items-center justify-center mb-4 md:mb-5 group-hover:border-[#CDA566] group-hover:-translate-y-2 transition-all duration-300 text-[#CDA566] shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(205,165,102,0.15)]">
                  <Icon strokeWidth={1.5} size={28} />
                </div>
                <span className="text-[12px] font-bold text-[#424242] leading-snug max-w-[100px] group-hover:text-[#2B4A3F] transition-colors">{event.name}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EventsWeHostSection;
