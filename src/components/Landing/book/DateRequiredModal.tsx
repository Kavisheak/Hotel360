"use client";

import React from "react";
import { CalendarX, X } from "lucide-react";

interface DateRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DateRequiredModal({ isOpen, onClose }: DateRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#1A1A1A] w-full max-w-md border border-[#E8DFC9] dark:border-gray-800 shadow-2xl rounded-sm p-8 text-center animate-fadeIn">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1A1512] dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#FAF6EE] dark:bg-[#0A0A0A] border border-[#E8DFC9] dark:border-gray-800 flex items-center justify-center text-[#C69C6D]">
            <CalendarX className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-3">
          Date Selection Required
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
          To provide you with an accurate bespoke statement and ensure exclusivity, please select your preferred event date from the available days in the calendar before proceeding.
        </p>

        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-[#C69C6D] text-white text-[10px] uppercase font-bold tracking-widest hover:bg-[#B58B5C] transition-colors rounded-sm shadow-md"
        >
          Return to Calendar
        </button>
      </div>
    </div>
  );
}
