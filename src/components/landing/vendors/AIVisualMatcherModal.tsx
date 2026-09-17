import React, { useRef, useState } from 'react';
import { X, UploadCloud, BrainCircuit, CheckCircle2, Sparkles } from 'lucide-react';

interface AIVisualMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchComplete: (analysis: any) => void;
}

export default function AIVisualMatcherModal({ isOpen, onClose, onMatchComplete }: AIVisualMatcherModalProps) {
  const [isAiScanning, setIsAiScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAiUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAiScanning(true);

    const formData = new FormData();
    formData.append("referenceImage", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/ai/match-design`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        // Automatically close modal and send data back
        setTimeout(() => {
          setIsAiScanning(false);
          onMatchComplete(data.data);
          onClose();
        }, 1000); // give it a sec to show 100% maybe? Actually let's just close
      } else {
        alert(data.message || "Failed to analyze image.");
        setIsAiScanning(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to AI service.");
      setIsAiScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#FDF9F1] dark:bg-[#111111] rounded-2xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl border border-[#C9A84C]/30 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          disabled={isAiScanning}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#805D3A] p-[1px] shadow-lg mx-auto mb-4">
            <div className="w-full h-full bg-[#1A1512] rounded-2xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-[#C9A84C]" />
            </div>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1A1512] dark:text-white flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            AI Visual Matcher
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Upload your decoration inspiration and let our AI find the 3-best matching decoration styles for your event.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] border border-dashed border-[#C9A84C]/50 rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            onChange={handleAiUpload}
            className="hidden" 
          />
          {isAiScanning ? (
            <div className="flex flex-col items-center space-y-4 py-4 w-full">
              <BrainCircuit className="w-12 h-12 text-[#C9A84C] animate-pulse" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#1A1512] dark:text-white uppercase tracking-widest">Azure AI Engine Running</h4>
                <p className="text-xs text-[#C9A84C] animate-pulse">Extracting visual features & matching portfolio tags...</p>
              </div>
              <div className="w-full max-w-md h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-[#C9A84C] animate-[progress_2s_ease-in-out_infinite]" style={{ width: "60%" }}></div>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center space-y-4 cursor-pointer py-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#FAF6EE] dark:bg-[#111] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] group-hover:scale-110 transition-transform shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <button type="button" className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#B58B5C] text-white text-xs uppercase font-bold tracking-widest rounded-sm transition-colors cursor-pointer shadow-md">
                  Upload Inspiration
                </button>
              </div>
              <p className="text-xs text-gray-400">Supports JPG, PNG (Max 5MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
