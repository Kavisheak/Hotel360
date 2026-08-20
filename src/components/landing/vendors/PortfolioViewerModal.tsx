"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check, PlayCircle, Users } from 'lucide-react';
import { PortfolioItem, Vendor } from './types';

interface PortfolioViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioItem: PortfolioItem | null;
  vendor: Vendor | null;
  onSelectDesign?: () => void;
  hideSelectButton?: boolean;
  onViewVendorProfile?: () => void;
}

const colorMap: Record<string, string> = {
  White: '#FFFFFF',
  Gold: '#FFD700',
  Red: '#FF0000',
  Pink: '#FFC0CB',
  Blue: '#0000FF',
  Green: '#008000',
  Purple: '#800080',
  Silver: '#C0C0C0',
  Black: '#000000',
  Custom: 'conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const PortfolioViewerModal = ({ isOpen, onClose, portfolioItem, vendor, onSelectDesign, hideSelectButton, onViewVendorProfile }: PortfolioViewerModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const mediaList = portfolioItem?.media?.length ? portfolioItem.media : (portfolioItem as any)?.image ? [{ url: (portfolioItem as any).image }] : [];

  useEffect(() => {
    if (!isOpen || mediaList.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((p) => (p + 1) % mediaList.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((p) => (p - 1 + mediaList.length) % mediaList.length);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mediaList.length, onClose]);

  if (!isOpen || !portfolioItem || !vendor || !mounted) return null;

  const currentMedia = mediaList[currentIndex];

  const getMediaUrl = (url?: string) => {
    if (!url) return undefined;
    return url.startsWith('http') ? url : `${API_URL}${url}`;
  };

  const handleNext = () => setCurrentIndex((p) => (p + 1) % mediaList.length);
  const handlePrev = () => setCurrentIndex((p) => (p - 1 + mediaList.length) % mediaList.length);

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-100"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-900 transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: VISUAL PORTFOLIO (58%) */}
        <div className="w-full md:w-[58%] bg-[#FAF8F5] relative flex flex-col h-[45vh] md:h-auto min-h-[400px]">
          {/* Main Media Area */}
          <div className="flex-1 relative overflow-hidden group bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100"
              >
                {((currentMedia as any)?.resourceType === 'video' || (currentMedia as any)?.mediaType === 'video') ? (
                  <video 
                    src={getMediaUrl(currentMedia.url)} 
                    autoPlay 
                    loop 
                    muted
                    controls 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={getMediaUrl(currentMedia?.url)} 
                    alt="Portfolio visual" 
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {mediaList.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {mediaList.length > 1 && (
            <div className="h-24 bg-white border-t border-gray-100 p-3 overflow-x-auto flex items-center gap-2 custom-scrollbar">
              {mediaList.map((m, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex ? 'border-[#D4AF37]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {((m as any).resourceType === 'video' || (m as any).mediaType === 'video') ? (
                    <>
                      <video src={getMediaUrl(m.url)} className="w-full h-full object-cover pointer-events-none" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <img src={getMediaUrl(m.url)} className="w-full h-full object-cover" alt="thumbnail" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INFORMATION PANEL (42%) */}
        <div className="w-full md:w-[42%] flex flex-col h-full md:max-h-[95vh] overflow-y-auto bg-white custom-scrollbar p-6 md:p-10 relative">
          
          <div className="flex-1 space-y-6 pb-24">
            {/* Title & Badges */}
            <div className="space-y-3">
              {portfolioItem.eventType && (
                <span className="inline-block px-3 py-1 bg-[#FDF8EB] text-[#C9A84C] text-[10px] font-extrabold tracking-widest uppercase rounded-full border border-[#F2E5C5]">
                  {portfolioItem.eventType}
                </span>
              )}
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                {portfolioItem.title}
              </h2>
              {/* Optional Guest Capacity */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-gray-400" /> Suitable for Any Capacity
              </div>
            </div>

            {/* Price */}
            {vendor?.category?.toLowerCase() === 'decorators' && (
              <div className="pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">Package Price</span>
                <div className="text-3xl md:text-4xl font-bold text-[#D4AF37]">
                  <span className="text-xl mr-1">LKR</span>
                  {portfolioItem.price ? portfolioItem.price.toLocaleString() : "Custom Quote"}
                </div>
              </div>
            )}

            {/* Description */}
            {portfolioItem.description && (
              <p className="text-sm text-gray-600 leading-relaxed pt-2">
                {portfolioItem.description}
              </p>
            )}

            {/* Tags / Checklists */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              
              {/* Decoration Style */}
              {portfolioItem.decorationStyle && portfolioItem.decorationStyle.length > 0 && (
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 block">Decoration Style</span>
                  <div className="flex flex-wrap gap-2">
                    {portfolioItem.decorationStyle.map(style => (
                      <span key={style} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-100">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Theme */}
              {portfolioItem.colorTheme && portfolioItem.colorTheme.length > 0 && (
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 block">Available Color Themes</span>
                  <div className="flex flex-wrap gap-3">
                    {portfolioItem.colorTheme.map(color => (
                      <div key={color} className="flex items-center gap-1.5">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200 shadow-inner" 
                          style={{ background: colorMap[color] || '#E5E7EB' }}
                        />
                        <span className="text-xs font-semibold text-gray-700">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included */}
              {portfolioItem.servicesProvided && portfolioItem.servicesProvided.length > 0 && (
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 block">What's Included</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                    {portfolioItem.servicesProvided.map(item => (
                      <div key={item} className="flex items-start gap-2">
                        <div className="mt-0.5 p-0.5 bg-emerald-50 rounded text-emerald-500">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Bottom Action Area */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent pt-12">
            {!hideSelectButton ? (
              <button 
                onClick={() => {
                  if (onSelectDesign) onSelectDesign();
                  onClose();
                }}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {vendor?.category?.toLowerCase() === 'videographers' ? 'Book Service' : vendor?.category?.toLowerCase() === 'djs' ? 'Book DJ' : 'Select This Design'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (onViewVendorProfile) onViewVendorProfile();
                  else if ((vendor as any)?._id || vendor?.id) window.open(`/vendors/${(vendor as any)?._id || vendor?.id}`, "_blank");
                  onClose();
                }}
                className="w-full py-4 bg-[#C9A84C] hover:bg-[#A6955C] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                View Vendor Profile
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            )}
          </div>

        </div>
      </motion.div>
    </div>,
    document.body
  );
};
