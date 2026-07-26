"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutModal({ isOpen, onClose, onConfirm }: SignOutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm bg-white dark:bg-gradient-to-b dark:from-[#1A1610] dark:to-[#0A0A0A] shadow-[0_0_40px_-10px_rgba(212,201,168,0.6)] dark:shadow-[0_0_60px_-15px_rgba(201,168,76,0.3)] border border-[#D4C9A8] dark:border-[#C9A84C]/60 overflow-hidden rounded-2xl"
          >
            
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-400 to-red-600 dark:from-red-900 dark:via-red-500 dark:to-red-900" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#2C1E14] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-950/30 border border-red-200 dark:border-red-500/30 flex items-center justify-center mb-6 shadow-lg shadow-red-500/10 relative">
                <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse"></div>
                <LogOut className="w-6 h-6 text-red-500 relative z-10" />
              </div>
              
              <h3 className="text-2xl font-serif text-[#2C1E14] dark:text-white mb-3">
                Confirm Sign Out
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed">
                Are you sure you want to log out of your account? You will need to sign in again to access your saved vendors and bookings.
              </p>
              
              <div className="flex flex-col w-full gap-3 mt-2">
                <button 
                  onClick={onConfirm}
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-[11px] uppercase tracking-[0.2em] font-bold shadow-lg shadow-red-500/30 transition-all rounded-xl btn-interactive"
                >
                  Yes, Sign Out
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

  return createPortal(modalContent, document.body);
}
