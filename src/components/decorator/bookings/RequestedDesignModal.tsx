import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getApiImageUrl } from '@/lib/vendorUtils';

interface RequestedDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: any;
}

const RequestedDesignModal: React.FC<RequestedDesignModalProps> = ({ isOpen, onClose, design }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset index when modal opens with a new design
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, design]);

  if (!isOpen || !design) return null;

  // Compile all images into an array
  let allImages: string[] = [];
  if (design.media && design.media.length > 0) {
    allImages = design.media.map((m: any) => getApiImageUrl(m.url)).filter(Boolean);
  } else if (design.coverUrl) {
    allImages = [getApiImageUrl(design.coverUrl)];
  }

  const hasImages = allImages.length > 0;
  const currentImageUrl = hasImages ? allImages[currentImageIndex] : "";

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0D8C3] bg-[#FDF9F1]">
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Requested Design Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors bg-white p-1.5 rounded-full shadow-xs border border-[#E0D8C3]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Main Image Viewer */}
          <div className="relative aspect-video bg-[#FAF6EE] rounded-lg border border-[#E0D8C3] overflow-hidden mb-6 flex items-center justify-center group">
            {hasImages ? (
              <>
                <img
                  src={currentImageUrl}
                  alt={design.title}
                  className="w-full h-full object-contain bg-black/5"
                />
                
                {/* Navigation Arrows (only show if multiple images) */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={24} />
                    </button>
                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImageIcon size={48} className="mb-2" />
                <span className="text-sm">No cover image available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="mb-6">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              {design.title}
            </h3>
            
            {design.price > 0 && (
              <div className="inline-block px-3 py-1 bg-[#FEF9E8] border border-[#D4B553] text-[#7C6A2E] text-sm font-bold rounded-md mb-4">
                Package Price: LKR {Number(design.price).toLocaleString()}
              </div>
            )}

            <div className="text-gray-600 text-sm leading-relaxed">
              <h4 className="font-bold text-gray-800 mb-1">Description / Notes:</h4>
              <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-100">
                {design.description || "No specific description provided."}
              </p>
            </div>
          </div>

          {/* Thumbnails Gallery */}
          {allImages.length > 1 && (
            <div>
              <h4 className="font-bold text-gray-800 text-sm mb-3">All Images ({allImages.length}):</h4>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded border-2 overflow-hidden transition-all ${
                      currentImageIndex === idx ? 'border-[#D4B553] opacity-100 shadow-md' : 'border-[#E0D8C3] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold uppercase tracking-wider rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default RequestedDesignModal;
