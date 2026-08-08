import React, { useState } from 'react';
import { Scan, UploadCloud, Maximize2 } from 'lucide-react';

const VirtualExperience = ({ data, onChange }: any) => {
  if (!data) return null;

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col md:flex-row gap-6 relative">
      {/* Left Settings Panel */}
      <div className="flex-1 space-y-6">
        {/* Header with Toggle */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#E0D8C3] rounded text-[#7C6A2E]">
              <Scan size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-950">Virtual Experience</h2>
              <h2 className="text-xl font-serif font-bold text-gray-950 -mt-1.5">Management</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase text-right leading-tight">
              Public<br />Visibility
            </span>
            <button
              onClick={() => onChange({ ...data, isPublic: !data.isPublic })}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-none ${data.isPublic ? 'bg-[#B08D2C]' : 'bg-gray-300'
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${data.isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* 360 Tour Source URL Input */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            360° Tour Source URL
          </label>
          <input
            type="text"
            value={data.sourceUrl}
            onChange={(e) => onChange({ ...data, sourceUrl: e.target.value })}
            className="w-full border border-[#E0D8C3] text-xs py-3 px-4 text-gray-700 bg-transparent focus:outline-none font-mono"
          />
        </div>

        {/* 3D Model File Upload */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            3D Model File (.GLB)
          </label>
          <div className="border border-dashed border-[#E0D8C3] bg-[#FAF6EE] py-6 px-4 rounded-sm flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F2EADA] transition-colors">
            <UploadCloud size={24} className="text-[#7C6A2E] mb-2" />
            <p className="text-xs text-gray-800 font-bold">
              Click to upload <span className="font-normal text-gray-500">or drag and drop</span>
            </p>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">
              GLB, GLTF (Max 50MB)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button className="bg-[#EAE5D9] hover:bg-[#DDD7C9] text-gray-800 font-bold text-[10px] tracking-widest uppercase px-5 py-3 transition-colors">
            Optimize Assets
          </button>
          <button className="bg-[#EAE5D9] hover:bg-[#DDD7C9] text-gray-800 font-bold text-[10px] tracking-widest uppercase px-5 py-3 transition-colors">
            Clear Cache
          </button>
        </div>
      </div>

      {/* Right Interactive Preview */}
      <div className="w-full md:w-[260px] h-[340px] md:h-auto min-h-[300px] relative overflow-hidden group">
        <img
          src="/ballroom_preview.png"
          alt="Interactive Preview"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-center items-center" />

        {/* Label inside */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white/95 text-gray-800 text-[10px] font-bold tracking-[0.25em] uppercase px-4 py-2 border border-[#E0D8C3] shadow-md pointer-events-none">
            Interactive Preview
          </span>
        </div>

        {/* Maximize Button */}
        <button className="absolute bottom-4 right-4 bg-[#B08D2C] hover:bg-[#9B7A20] text-white p-2.5 transition-colors shadow-lg">
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default VirtualExperience;
