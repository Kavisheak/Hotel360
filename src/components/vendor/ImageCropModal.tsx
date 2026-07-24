"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Upload, Check, Trash2, Sliders } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedBlob: Blob) => Promise<void>;
  onDeleteAvatar?: () => Promise<void>;
  currentAvatar?: string;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  onSave,
  onDeleteAvatar,
  currentAvatar,
}: ImageCropModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setSelectedFile(null);
      setImageSrc(null);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (JPEG, PNG, WebP).");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      const size = 320;
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);
      ctx.save();

      // Move context to center for rotation & scale
      ctx.translate(size / 2 + offset.x, size / 2 + offset.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Draw image centered
      const aspect = img.width / img.height;
      let drawW = size;
      let drawH = size;
      if (aspect > 1) {
        drawH = size / aspect;
      } else {
        drawW = size * aspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    };
  };

  useEffect(() => {
    if (imageSrc) {
      drawCanvas();
    }
  }, [imageSrc, zoom, rotation, offset]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    canvas.toBlob(
      async (blob) => {
        if (blob) {
          try {
            await onSave(blob);
            onClose();
          } catch (e) {
            console.error("Crop save error:", e);
          } finally {
            setIsSaving(false);
          }
        }
      },
      "image/jpeg",
      0.92
    );
  };

  const handleDelete = async () => {
    if (!onDeleteAvatar) return;
    if (confirm("Are you sure you want to remove your profile picture?")) {
      setIsDeleting(true);
      try {
        await onDeleteAvatar();
        onClose();
      } catch (e) {
        console.error("Delete avatar error:", e);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF6EE] dark:bg-[#141414] border border-[#E0D8C3] dark:border-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0D8C3] dark:border-gray-800 flex items-center justify-between bg-[#F5EFE0]/50 dark:bg-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#7C6A2E] dark:text-[#C9A84C]" />
            <h3 className="font-serif italic font-bold text-lg text-[#7C6A2E] dark:text-[#C9A84C]">
              Adjust Profile Picture
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 flex flex-col items-center">
          {!imageSrc ? (
            <div className="w-full flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-[#B08D2C]/40 hover:border-[#B08D2C] bg-white dark:bg-[#1A1A1A] rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all hover:scale-[0.99] group shadow-inner"
              >
                <div className="w-16 h-16 rounded-full bg-[#FAF6EE] dark:bg-[#252525] border border-[#E0D8C3] dark:border-gray-700 flex items-center justify-center mb-3 group-hover:bg-[#7C6A2E] group-hover:text-white text-[#7C6A2E] transition-colors">
                  <Upload size={24} />
                </div>
                <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white uppercase tracking-wider mb-1">
                  Upload Profile Photo
                </h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  Click to select a high-quality photo. JPG, PNG or WebP accepted.
                </p>
              </div>

              {currentAvatar && onDeleteAvatar && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/40 transition-colors"
                  >
                    <Trash2 size={14} />
                    {isDeleting ? "Removing..." : "Remove Current Picture"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center w-full space-y-5">
              {/* Canvas Area */}
              <div className="relative w-80 h-80 rounded-xl overflow-hidden border-2 border-[#B08D2C] bg-black shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="w-full h-full object-cover"
                />
                {/* Circular Crop Overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
              </div>

              {/* Controls */}
              <div className="w-full space-y-4 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-[#E0D8C3] dark:border-gray-800">
                {/* Zoom Control */}
                <div className="flex items-center gap-3">
                  <ZoomOut size={16} className="text-gray-500" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-[#7C6A2E] cursor-pointer"
                  />
                  <ZoomIn size={16} className="text-gray-500" />
                  <span className="text-xs font-mono font-bold w-12 text-right text-gray-600 dark:text-gray-300">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Rotate & Re-select */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6EE] dark:bg-[#252525] border border-[#E0D8C3] dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 rounded-md hover:bg-[#E8DFC9] transition-colors"
                  >
                    <RotateCw size={14} /> Rotate 90°
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#7C6A2E] dark:text-[#C9A84C] hover:underline"
                  >
                    Choose Different Image
                  </button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0D8C3] dark:border-gray-800 flex justify-end gap-3 bg-[#F5EFE0]/50 dark:bg-[#1A1A1A]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-[#E0D8C3] text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          {imageSrc && (
            <button
              onClick={handleApplyCrop}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#7C6A2E] hover:bg-[#5E4F20] disabled:bg-gray-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors shadow-md"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Check size={16} /> Apply & Save Avatar
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
