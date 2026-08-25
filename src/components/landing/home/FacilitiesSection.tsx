"use client";

import React from 'react';
import Image from 'next/image';
import { Users, MonitorPlay, UserCheck, ArrowRight, Music, Camera, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';

const FacilitiesSection = () => {
  const router = useRouter();

  const facilities = [
    {
      id: 'silver',
      name: 'Silver Package',
      capacity: 'Up to 250 Guests',
      description: 'An intimate ceremony of refined essentials.',
      image: '/tour/vip-lounge.png',
      icons: [Users, Music, Camera]
    },
    {
      id: 'gold',
      name: 'Gold Package',
      capacity: 'Up to 380 Guests',
      description: 'Our most chosen — celebrated for its balance.',
      image: '/tour/dining.png',
      icons: [Users, MonitorPlay, Utensils]
    },
    {
      id: 'diamond',
      name: 'Diamond Package',
      capacity: 'Up to 480 Guests',
      description: 'A no-restraint affair — the venue, entirely yours.',
      image: '/tour/grand-hall.png',
      icons: [Users, UserCheck, MonitorPlay]
    }
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col items-center overflow-hidden border-t border-[#E8DFC9]">
      <div className="max-w-[1400px] w-full flex flex-col">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={slideUpVariants}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 mobile-no-anim"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="w-8 h-[1.5px] bg-[#C89E62]"></div>
              <p className="text-[#C89E62] text-[11px] tracking-[0.25em] uppercase font-bold">
                Premium Facilities
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#2B4A3F] leading-[1.1] font-medium">
              Spaces That Fit Your Vision
            </h2>
          </div>
          <button 
            onClick={() => router.push('/packages')}
            className="w-fit mx-auto md:mx-0 bg-transparent border border-[#CDA566] text-[#7D7D7D] px-8 py-3.5 rounded-md flex items-center justify-center gap-2 text-[12px] tracking-wider font-bold hover:bg-[#FAF8F5] transition-all whitespace-nowrap"
          >
            VIEW ALL FACILITIES
            <ArrowRight className="w-3.5 h-3.5 ml-1 stroke-[3]" />
          </button>
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mobile-no-anim"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {facilities.map((facility) => (
            <motion.div 
              key={facility.id} 
              variants={slideLeftVariants}
              className="bg-white rounded-2xl overflow-hidden border border-[#F0EBE1] shadow-[0_10px_30px_rgba(0,0,0,0.04)] group hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex flex-col flex-1 bg-[#FAF8F5]">
                <h3 className="text-2xl font-serif text-[#2B4A3F] mb-2">{facility.name}</h3>
                <p className="text-[#6B6B6B] text-[14px] leading-relaxed mb-8 flex-1">{facility.description}</p>
                
                <div className="flex items-center justify-between border-t border-[#E8DFC9] pt-6">
                  <div className="flex items-center gap-3 text-[#CDA566]">
                    {facility.icons.map((Icon, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-white border border-[#EADDC4] flex items-center justify-center">
                        <Icon size={14} strokeWidth={2} />
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => router.push('/packages')}
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#2B4A3F] group-hover:text-[#CDA566] transition-colors"
                  >
                    View Details
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
