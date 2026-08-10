import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const AISentiment = ({ data, onChange }: any) => {
  if (!data) return null;

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 border border-[#E0D8C3] rounded text-[#7C6A2E]">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-950">AI</h2>
          <h2 className="text-xl font-serif font-bold text-gray-950 -mt-1.5">Sentiment Analysis</h2>
        </div>
      </div>

      {/* Threshold Slider */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label className="text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase">
            Negative Review Threshold
          </label>
          <span className="text-sm font-serif font-bold text-gray-800">{data.negativeThreshold.toFixed(1)} / 5.0</span>
        </div>
        <input
          type="range"
          min="1.0"
          max="5.0"
          step="0.1"
          value={data.negativeThreshold}
          onChange={(e) => onChange({ ...data, negativeThreshold: parseFloat(e.target.value) })}
          className="w-full accent-[#B08D2C] cursor-pointer"
        />
        <p className="text-[10px] text-gray-400 italic mt-2">
          Reviews below this score will automatically flag providers for audit.
        </p>
      </div>



      {/* Notifications Toggle */}
      <div className="border-t border-[#E0D8C3] pt-4 flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-wider text-gray-600">
          Automated Manager Notifications
        </span>
        <button
          onClick={() => onChange({ ...data, automatedNotifications: !data.automatedNotifications })}
          className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-none ${data.automatedNotifications ? 'bg-[#B08D2C]' : 'bg-gray-300'
            }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${data.automatedNotifications ? 'translate-x-5' : 'translate-x-0'
              }`}
          />
        </button>
      </div>
    </div>
  );
};

export default AISentiment;
