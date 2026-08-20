"use client";

import React, { useRef } from 'react';
import { ArrowRight, PlayCircle, Building2, Award, ConciergeBell } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';

const LandingHero = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth out the scroll progress for a buttery Apple-like feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Transformations based on scroll progress
  const yBg = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const scaleBg = useTransform(smoothProgress, [0, 1], [1, 0.95]);
  const opacityBg = useTransform(smoothProgress, [0, 1], [1, 0.4]);
  
  const yText = useTransform(smoothProgress, [0, 1], ["0%", "-40%"]);
  const opacityText = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const scaleText = useTransform(smoothProgress, [0, 0.4], [1, 0.95]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as any } 
    }
  };

  const bottomBarVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] as any } }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen flex flex-col font-sans text-[#2C1E14] dark:text-white overflow-hidden bg-[#FAF8F5] dark:bg-[#0A0A0A] transition-colors duration-300">
      {/* Background Image Container with parallax & scaling */}
      <motion.div 
        style={{ y: yBg, scale: scaleBg, opacity: opacityBg }}
        className="absolute inset-0 z-0 pointer-events-none origin-bottom mobile-no-anim"
      >
        <video 
          src="/video/EASCCA_hall_clean_up_prompt_202608121748.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#E3C77B]/20 dark:bg-[#7B5B2E]/20 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/60 via-white/40 to-white/90 dark:from-black/95 dark:via-black/50 dark:to-black/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0A0A0A]/80 dark:via-transparent dark:to-transparent pointer-events-none" />
        {/* Horizontal gradient to wash out the center for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/95 to-transparent dark:via-[#0A0A0A]/95 pointer-events-none"></div>
      </motion.div>

      <style>{`
        @keyframes legacy-zoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-legacy {
          display: inline-block;
          animation: legacy-zoom 5s ease-in-out infinite;
          color: #8C6A21;
        }
      `}</style>

      {/* Main Content with Parallax & Fade on Scroll */}
      <motion.main 
        style={{ y: yText, opacity: opacityText, scale: scaleText }}
        className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pt-24 pb-10"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 flex flex-col items-center mobile-no-anim"
        >
          {/* Overline */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="w-8 h-[1px] bg-[#805D3A]/40 dark:bg-[#C9A84C]/60"></div>
            <p className="text-[#805D3A] dark:text-white/90 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-semibold">
              SOUTH ASIA'S SIGNATURE CELEBRATION & CONVENTION CENTER
            </p>
            <div className="w-8 h-[1px] bg-[#805D3A]/40 dark:bg-[#C9A84C]/60"></div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-8xl font-serif leading-tight text-[#2C1E14] dark:text-white">
            Where Every Union<br />
            <span className="italic font-light animate-legacy">Becomes A Legacy</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="max-w-2xl text-[#805D3A] dark:text-gray-200 text-sm md:text-base leading-relaxed font-medium">
            A timeless wedding sanctuary in the heart of Batticaloa — crafted for stories 
            who deserve to be remembered forever.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="pt-8 flex flex-col sm:flex-row items-center gap-6">
            <button 
              onClick={() => router.push('/book')}
              className="group btn-interactive w-full sm:w-auto bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-black px-8 py-3.5 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-[#C9A84C] dark:hover:bg-[#B5953F] hover:scale-105 hover:shadow-[0_8px_30px_rgba(201,168,76,0.3)] active:scale-95 transition-all duration-300"
            >
              Reserve Your Date
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button 
              onClick={() => router.push('/customer/packages')}
              className="group btn-interactive w-full sm:w-auto border border-[#D4C9A8] dark:border-[#C9A84C]/50 bg-white dark:bg-transparent backdrop-blur-sm text-[#805D3A] dark:text-[#C9A84C] px-8 py-3.5 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-gray-50 dark:hover:bg-[#C9A84C]/10 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300"
            >
              Explore Packages
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>

        </motion.div>
      </motion.main>

      {/* Bottom Bar overlaying the hero */}
      <motion.div 
        variants={bottomBarVariants}
        initial="hidden"
        animate="visible"
        className="hidden sm:block absolute bottom-0 left-0 w-full bg-transparent border-t border-white/20 dark:border-white/10 z-20"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex-1 w-full sm:w-auto py-5 flex justify-center items-center gap-3 border-r border-[#805D3A]/10 dark:border-white/10">
            <Building2 size={16} className="text-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#805D3A] dark:text-[#C9A84C]">Curated Spaces</span>
          </div>
          <div className="flex-1 w-full sm:w-auto py-5 flex justify-center items-center gap-3 border-r border-[#805D3A]/10 dark:border-white/10">
            <Award size={16} className="text-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#805D3A] dark:text-[#C9A84C]">Top Service</span>
          </div>
          <div className="flex-1 w-full sm:w-auto py-5 flex justify-center items-center gap-3">
            <ConciergeBell size={16} className="text-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#805D3A] dark:text-[#C9A84C]">Best Catering</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingHero;