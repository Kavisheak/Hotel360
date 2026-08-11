import React, { useState } from "react";
import { X, ArrowRight, Check } from "lucide-react";

interface VendorReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dontAskAgain: boolean) => void;
  categoryLabel: string;
  newVendorName: string;
  rating?: number;
  price?: number;
}

export default function VendorReplaceModal({
  isOpen,
  onClose,
  onConfirm,
  categoryLabel,
  newVendorName,
  rating,
  price
}: VendorReplaceModalProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#FDFBF7] dark:bg-[#1A1A1A] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Decorative background leaves (simplified SVG approximations) */}
        <div className="absolute top-0 right-0 pointer-events-none opacity-20">
           <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M50 0C50 0 80 20 80 50C80 80 50 100 50 100C50 100 20 80 20 50C20 20 50 0 50 0Z" stroke="#C9A84C" strokeWidth="1"/>
           </svg>
        </div>

        {/* Bottom left gold accent curve */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C9A84C] rounded-tr-full opacity-90 pointer-events-none -translate-x-10 -translate-y-[-2rem]" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#2C1E14] dark:hover:text-white transition-colors z-50 cursor-pointer p-2"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-8 pt-10 text-center z-10">
          
          {/* Circular Question Icon */}
          <div className="mx-auto w-16 h-16 rounded-full border border-[#C9A84C]/40 flex items-center justify-center bg-gradient-to-b from-white to-[#FAF6EE] dark:from-[#2A2A2A] dark:to-[#1A1A1A] shadow-sm mb-6 relative">
             <span className="text-2xl text-[#C9A84C] font-serif font-bold">?</span>
             {/* Decorative small leaves around icon */}
             <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none text-[#C9A84C]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 2Z"/></svg>
             </div>
             <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none text-[#C9A84C]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 2Z"/></svg>
             </div>
          </div>

          <h2 className="text-2xl font-serif text-[#4A3B2C] dark:text-white font-bold mb-4">
            Confirm Your Selection
          </h2>
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-[1px] w-12 bg-[#C9A84C]/30"></div>
            <div className="text-[#C9A84C]">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 2Z"/></svg>
            </div>
            <div className="h-[1px] w-12 bg-[#C9A84C]/30"></div>
          </div>

          <p className="text-[#4A3B2C] dark:text-gray-300 text-sm md:text-base mb-6">
            Are you sure you want to replace your current {categoryLabel} with <br />
            <span className="text-[#C9A84C] font-bold text-lg inline-block mt-1">{newVendorName}</span>?
          </p>

          {/* Don't ask again checkbox */}
          <div className="flex items-center justify-center gap-2 mb-8 cursor-pointer" onClick={() => setDontAskAgain(!dontAskAgain)}>
            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${dontAskAgain ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-gray-300 dark:border-gray-600'}`}>
              {dontAskAgain && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
            <span className="text-xs text-gray-500 select-none">Don't show this confirmation again</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 relative z-10">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-[#C9A84C] text-[#C9A84C] bg-white dark:bg-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C9A84C]/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(dontAskAgain)}
              className="flex-1 py-3 px-4 bg-[#C9A84C] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#B89238] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C9A84C]/20 cursor-pointer"
            >
              Confirm Replacement <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
