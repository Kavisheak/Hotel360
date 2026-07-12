"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function LoginRequiredModal({ isOpen, onClose, message }: LoginRequiredModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like easing
            className="relative w-full max-w-md bg-white dark:bg-gradient-to-b dark:from-[#1A1610] dark:to-[#0A0A0A] shadow-[0_0_40px_-10px_rgba(212,201,168,0.6)] dark:shadow-[0_0_60px_-15px_rgba(201,168,76,0.3)] border border-[#D4C9A8] dark:border-[#C9A84C]/60 overflow-hidden rounded-2xl"
          >
            
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#C69C6D] via-[#E8DFC9] to-[#C69C6D] dark:from-[#8A6333] dark:via-[#C9A84C] dark:to-[#8A6333]" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#2C1E14] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FDFBF7] to-[#F0E6D0] dark:from-[#2A1D11] dark:to-[#110D08] border border-[#D4C9A8] dark:border-[#C9A84C]/60 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,201,168,0.4)] dark:shadow-[0_0_25px_rgba(201,168,76,0.25)] relative">
                <div className="absolute inset-0 rounded-full bg-[#C9A84C]/10 dark:bg-[#C9A84C]/20 animate-pulse"></div>
                <Lock className="w-6 h-6 text-[#A67C52] dark:text-[#C9A84C] relative z-10" />
              </div>
              
              <h3 className="text-2xl font-serif text-[#2C1E14] dark:text-white mb-3">
                Please Log In
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed">
                {message}
              </p>
              
              <div className="flex flex-col w-full gap-3 mt-2">
                <button 
                  onClick={() => router.push("/login")}
                  className="w-full py-3.5 bg-gradient-to-r from-[#A67C52] to-[#805D3A] dark:from-[#D4AF37] dark:to-[#B89238] text-white dark:text-[#1A1A1A] text-[11px] uppercase tracking-[0.2em] font-bold hover:shadow-lg hover:shadow-[#A67C52]/30 dark:hover:shadow-[#C9A84C]/30 transition-all rounded-xl btn-interactive"
                >
                  Log In Now
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-3.5 bg-transparent border border-[#D4C9A8] dark:border-gray-700 text-gray-600 dark:text-gray-400 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl btn-interactive"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
