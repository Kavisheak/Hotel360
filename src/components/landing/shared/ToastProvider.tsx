"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-[320px] px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border border-[#E8DFC9] dark:border-[#C9A84C]/30 shadow-[0_8px_30px_rgba(201,168,76,0.15)] rounded-sm p-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === "success" || !toast.type ? (
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C]" />
                </div>
              ) : toast.type === "error" ? (
                <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                </div>
              )}
              <span className="text-xs font-medium text-[#2C1E14] dark:text-gray-200">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
