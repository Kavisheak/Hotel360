import React from 'react';
import { Minus, Plus, Users } from 'lucide-react';

interface GuestCounterProps {
  count: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}

export default function GuestCounter({ count, onChange, min = 1, max = 5000 }: GuestCounterProps) {
  const handleDecrement = () => {
    if (count > min) {
      onChange(count - 50 < min ? min : count - 50);
    }
  };

  const handleIncrement = () => {
    if (count < max) {
      onChange(count + 50 > max ? max : count + 50);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      if (val >= min && val <= max) {
        onChange(val);
      } else if (val < min) {
        onChange(min);
      } else if (val > max) {
        onChange(max);
      }
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-xl p-4">
      <div className="flex-1 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#FAF6EE] dark:bg-[#C9A84C]/10">
          <Users className="w-5 h-5 text-[#C9A84C]" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#1A1512] dark:text-white">Total Guests</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">Min {min} - Max {max}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 bg-[#FAF6EE] dark:bg-zinc-900 rounded-lg border border-[#E8DFC9] dark:border-zinc-800 p-1">
        <button
          onClick={handleDecrement}
          disabled={count <= min}
          className="p-2 rounded hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors text-gray-600 dark:text-gray-400"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <input
          type="number"
          value={count}
          onChange={handleChange}
          className="w-16 text-center bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1A1512] dark:text-white"
          min={min}
          max={max}
        />
        
        <button
          onClick={handleIncrement}
          disabled={count >= max}
          className="p-2 rounded hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors text-gray-600 dark:text-gray-400"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
