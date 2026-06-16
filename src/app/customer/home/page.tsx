"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import MainNavbar from "@/components/landing/shared/MainNavbar";
import WelcomePanel from '@/components/customer/home/WelcomePanel';
import DashboardMetrics from '@/components/customer/home/DashboardMetrics';
import CeremonyDetails from '@/components/customer/home/CeremonyDetails';
import PendingTasks from '@/components/customer/home/PendingTasks';
import ConciergeAlerts from '@/components/customer/home/ConciergeAlerts';

export default function CustomerDashboard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Submit Auspicious Oils & Traditional Oil Lamp Requirements",
      subtext: "Setup Team Directive",
      color: "text-[#C9A84C]",
      completed: false
    },
    {
      id: 2,
      title: "Confirm Food Menu Customizations",
      subtext: "Urgent due tomorrow",
      color: "text-red-500",
      completed: false
    },
    {
      id: 3,
      title: "Submit Guest List Count Variance (If above 380 baseline)",
      subtext: "Concierge Directive",
      color: "text-gray-400",
      completed: false
    }
  ]);

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const baseCompleted = 13;
  const totalTasks = 16;
  const visibleCompleted = tasks.filter(t => t.completed).length;
  const totalCompleted = baseCompleted + visibleCompleted;
  const progressPercent = Math.round((totalCompleted / totalTasks) * 100);

  return (
    <div className="bg-[#F0E6D0] min-h-screen">
      <MainNavbar />
      <div className="space-y-8 text-[#2C1E14] px-6 py-10 max-w-7xl mx-auto overflow-hidden">
        <WelcomePanel />
        
        <DashboardMetrics 
          progressPercent={progressPercent}
          totalCompleted={totalCompleted}
          totalTasks={totalTasks}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Booking Preview & Concierge messages */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <CeremonyDetails />
            <PendingTasks tasks={tasks} onToggleTask={handleToggleTask} />
          </motion.div>

          {/* Right Side: Concierge Messages & Alerts */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <ConciergeAlerts />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
