"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckSquare, CreditCard, Heart, ArrowRight } from 'lucide-react';

interface DashboardMetricsProps {
  progressPercent: number;
  totalCompleted: number;
  totalTasks: number;
}

export default function DashboardMetrics({ progressPercent, totalCompleted, totalTasks }: DashboardMetricsProps) {
  const stats = [
    {
      label: "Checklist Progress",
      value: `${progressPercent}%`,
      subtext: `${totalCompleted} of ${totalTasks} completed`,
      icon: <CheckSquare className="w-5 h-5 text-[#C9A84C]" />,
      link: "#"
    },
    {
      label: "Payments Cleared",
      value: "50%",
      subtext: "LKR 1.85M of LKR 3.70M",
      icon: <CreditCard className="w-5 h-5 text-[#C9A84C]" />,
      link: "/customer/myaccount"
    },
    {
      label: "Creative Team",
      value: "3 Secured",
      subtext: "Decorator, DJ & Venue",
      icon: <Heart className="w-5 h-5 text-[#C9A84C]" />,
      link: "/customer/vendors"
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {stats.map((stat, idx) => (
        <motion.div 
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        >
          <Link 
            href={stat.link}
            className="bg-white dark:bg-[#111111] border border-[#D4C9A8] dark:border-[#C9A84C]/20 p-5 shadow-sm rounded-sm hover:border-[#C9A84C] dark:hover:border-[#C9A84C]/50 hover-lift hover-glow transition-all duration-300 block card-entrance"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{stat.label}</span>
                <span className="block text-2xl font-serif font-bold text-gray-900 dark:text-white mt-1">{stat.value}</span>
                <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-light mt-1.5">{stat.subtext}</span>
              </div>
              <div className="bg-[#F0E6D0] dark:bg-[#1A1512] p-2.5 rounded-sm border border-[#D4C9A8]/40 dark:border-[#C9A84C]/20">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0E6D0] dark:border-[#C9A84C]/20 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#C9A84C]">
              <span>Manage Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
