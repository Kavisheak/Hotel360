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
            className="relative w-full max-w-md bg-white dark:bg-[#111111] shadow-2xl border border-[#D4C9A8] dark:border-[#C9A84C]/30 overflow-hidden"
          >
            
            {/* Top accent bar */}
            <div className="h-1 w-full bg-[#805D3A] dark:bg-[#C9A84C]" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#2C1E14] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#F0E6D0] dark:bg-[#2C1E14] border border-[#D4C9A8] dark:border-[#C9A84C]/30 flex items-center justify-center mb-6 shadow-inner">
                <Lock className="w-5 h-5 text-[#805D3A] dark:text-[#C9A84C]" />
              </div>
              
              <h3 className="text-2xl font-serif text-[#2C1E14] dark:text-white mb-3">
                Authentication Required
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed">
                {message}
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={() => router.push("/login")}
                  className="w-full py-3 bg-[#805D3A] dark:bg-[#C9A84C] text-white dark:text-[#1A1A1A] text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#6A4B2D] dark:hover:bg-[#B89238] transition-colors shadow-md btn-interactive"
                >
                  Log In Now
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-transparent border border-[#D4C9A8] dark:border-gray-700 text-gray-600 dark:text-gray-400 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors btn-interactive"
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
