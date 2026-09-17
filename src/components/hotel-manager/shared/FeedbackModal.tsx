"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, ShieldAlert, Info, X, Crown, Sparkles } from "lucide-react";

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  badgeText?: string;
  buttonText?: string;
  details?: { label: string; value: string }[];
}

const FeedbackModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  badgeText,
  buttonText = "Continue",
  details,
}: FeedbackModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-[#FDF9F1] border border-[#E0D8C3] w-full max-w-md shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200 text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className={`h-1.5 w-full ${
          type === "success" 
            ? "bg-gradient-to-r from-[#B08D2C] via-[#F9DD76] to-[#7C6A2E]" 
            : type === "error" 
            ? "bg-gradient-to-r from-red-600 via-rose-400 to-red-600" 
            : "bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"
        }`} />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          {/* Icon Emblem */}
          <div className="relative inline-block mx-auto mb-5">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner border-2 ${
              type === "success"
                ? "bg-[#FAF6EE] border-[#B08D2C]/40 text-[#7C6A2E]"
                : type === "error"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-amber-50 border-amber-200 text-[#7C6A2E]"
            }`}>
              {type === "success" && <CheckCircle2 size={36} className="animate-bounce" />}
              {type === "error" && <AlertCircle size={36} className="animate-pulse" />}
              {type === "warning" && <ShieldAlert size={36} />}
              {type === "info" && <Info size={36} />}
            </div>
            {type === "success" && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#F9DD76] flex items-center justify-center text-[#5E4F20] shadow-sm">
                <Sparkles size={13} />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Details or Badge Card */}
          {(badgeText || (details && details.length > 0)) && (
            <div className="bg-[#FAF6EE] border border-[#E0D8C3] rounded-sm p-4 mb-6 text-left space-y-2.5">
              {badgeText && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-widest text-gray-400 text-[9px]">Status</span>
                  <span className="bg-[#7C6A2E] text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm flex items-center gap-1 shadow-xs">
                    <Crown size={10} className="text-[#F9DD76]" /> {badgeText}
                  </span>
                </div>
              )}
              {details && details.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-xs pt-1 border-t border-[#E0D8C3]/50">
                  <span className="font-bold uppercase tracking-widest text-gray-400 text-[9px]">{d.label}</span>
                  <span className="text-gray-800 font-semibold text-[11px] truncate max-w-[200px]">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.98] cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
