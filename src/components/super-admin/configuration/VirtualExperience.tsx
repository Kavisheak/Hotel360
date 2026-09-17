"use client";

import React, { useRef, useState } from 'react';
import { Scan, UploadCloud, Maximize2, CheckCircle, Loader2, X } from 'lucide-react';
import { superAdminAPI } from '@/lib/api';

const VirtualExperience = ({ data, onChange, showToast }: any) => {
  if (!data) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    data.modelUrl ? data.modelUrl.split('/').pop() : null
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['glb', 'gltf'].includes(ext || '')) {
      showToast?.('Only .glb or .gltf files are allowed.', 'error');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      showToast?.('File exceeds 50MB limit.', 'error');
      return;
    }

    setUploading(true);
    try {
      const { ok, data: result } = await superAdminAPI.uploadGlbModel(file);
      if (ok && result.success) {
        setUploadedFileName(file.name);
        // Update parent state so Save Config persists the new modelUrl
        onChange({ ...data, modelUrl: result.modelUrl });
        showToast?.('3D model uploaded successfully!', 'success');
      } else {
        showToast?.(result.message || 'Upload failed.', 'error');
      }
    } catch (err) {
      showToast?.('Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClearModel = () => {
    setUploadedFileName(null);
    onChange({ ...data, modelUrl: '' });
  };

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
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-none ${data.isPublic ? 'bg-[#B08D2C]' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${data.isPublic ? 'translate-x-5' : 'translate-x-0'}`}
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
            value={data.sourceUrl || ''}
            onChange={(e) => onChange({ ...data, sourceUrl: e.target.value })}
            placeholder="https://kuula.co/share/your-tour or any 360° viewer URL"
            className="w-full border border-[#E0D8C3] text-xs py-3 px-4 text-gray-700 bg-transparent focus:outline-none font-mono"
          />
          <p className="text-[9px] text-gray-400 mt-1">Paste a Kuula, Matterport, or self-hosted Pannellum URL. Saved via "Save Config".</p>
        </div>

        {/* 3D Model File Upload */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
            3D Model File (.GLB)
          </label>

          {uploadedFileName ? (
            /* Uploaded file badge */
            <div className="border border-green-200 bg-green-50 rounded-sm px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-xs text-green-800 font-medium truncate max-w-[200px]">{uploadedFileName}</span>
              </div>
              <button
                onClick={handleClearModel}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                title="Remove model"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            /* Drop zone */
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border border-dashed border-[#E0D8C3] bg-[#FAF6EE] py-6 px-4 rounded-sm flex flex-col items-center justify-center text-center transition-colors ${uploading ? 'cursor-wait opacity-70' : 'cursor-pointer hover:bg-[#F2EADA]'}`}
            >
              {uploading ? (
                <Loader2 size={24} className="text-[#7C6A2E] mb-2 animate-spin" />
              ) : (
                <UploadCloud size={24} className="text-[#7C6A2E] mb-2" />
              )}
              <p className="text-xs text-gray-800 font-bold">
                {uploading ? 'Uploading...' : (<>Click to upload <span className="font-normal text-gray-500">or drag and drop</span></>)}
              </p>
              <p className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">GLB, GLTF (Max 50MB)</p>
            </div>
          )}

          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Right Interactive Preview */}
      <div className="w-full md:w-[260px] h-[340px] md:h-auto min-h-[300px] relative overflow-hidden group">
        <img
          src="/ballroom_preview.png"
          alt="Interactive Preview"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-center items-center" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white/95 text-gray-800 text-[10px] font-bold tracking-[0.25em] uppercase px-4 py-2 border border-[#E0D8C3] shadow-md pointer-events-none">
            Interactive Preview
          </span>
        </div>
        <button className="absolute bottom-4 right-4 bg-[#B08D2C] hover:bg-[#9B7A20] text-white p-2.5 transition-colors shadow-lg">
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default VirtualExperience;
