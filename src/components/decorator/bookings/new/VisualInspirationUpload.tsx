import React from 'react';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';

const VisualInspirationUpload = () => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <ImageIcon size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
          VISUAL INSPIRATION
        </h3>
      </div>

      {/* Dashed Dropzone */}
      <div className="border-2 border-dashed border-[#E0D8C3] bg-[#FAF6EE] p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-[#F2EADA] transition-colors rounded-sm min-h-[160px]">
        <UploadCloud size={32} className="text-[#B08D2C] mb-3 opacity-80" />
        <p className="text-sm font-bold text-gray-700 tracking-wide mb-2">
          Drag and drop moodboard images, sketches or blueprints
        </p>
        <p className="text-xs text-gray-400 font-semibold">
          Supported file formats: PNG, JPG, PDF (Max 10MB)
        </p>
      </div>
    </div>
  );
};

export default VisualInspirationUpload;
