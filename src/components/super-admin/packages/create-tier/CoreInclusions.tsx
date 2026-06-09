import React from 'react';
import { X } from 'lucide-react';

interface InclusionsState {
  valet: boolean;
  bridal: boolean;
  led: boolean;
  catering: boolean;
}

interface CoreInclusionsProps {
  features: string[];
  newFeature: string;
  setNewFeature: (val: string) => void;
  handleAddFeature: (e: React.FormEvent) => void;
  handleRemoveFeature: (feat: string) => void;
  inclusions: InclusionsState;
  setInclusions: (val: InclusionsState) => void;
}

const CoreInclusions = ({
  features,
  newFeature,
  setNewFeature,
  handleAddFeature,
  handleRemoveFeature,
  inclusions,
  setInclusions
}: CoreInclusionsProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-serif font-bold text-gray-900 border-l-4 border-[#B08D2C] pl-3">
        Core Inclusions
      </h3>

      {/* Features Tags list */}
      <div className="flex flex-wrap gap-2 items-center">
        {features.map((feat) => (
          <span
            key={feat}
            className="bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-1.5 text-[10px] font-bold text-gray-700 tracking-wider flex items-center gap-2"
          >
            {feat}
            <button
              onClick={() => handleRemoveFeature(feat)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        
        {/* Plus add input */}
        <form onSubmit={handleAddFeature} className="inline-flex border border-dashed border-[#E0D8C3] hover:border-[#B08D2C] transition-colors bg-[#FAF6EE]">
          <input
            type="text"
            placeholder="+ Add feature..."
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className="bg-transparent text-[10px] font-bold tracking-wider py-1.5 px-3 focus:outline-none w-32 placeholder-[#7C6A2E] text-gray-700 italic"
          />
        </form>
      </div>

      <div className="h-px bg-[#F2EADA]" />

      {/* Checkboxes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold select-none">
          <input
            type="checkbox"
            checked={inclusions.valet}
            onChange={(e) => setInclusions({ ...inclusions, valet: e.target.checked })}
            className="accent-[#B08D2C] h-4 w-4 border-[#E0D8C3] rounded-sm"
          />
          Valet Parking
        </label>
        <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold select-none">
          <input
            type="checkbox"
            checked={inclusions.bridal}
            onChange={(e) => setInclusions({ ...inclusions, bridal: e.target.checked })}
            className="accent-[#B08D2C] h-4 w-4 border-[#E0D8C3] rounded-sm"
          />
          Bridal Suite
        </label>
        <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold select-none">
          <input
            type="checkbox"
            checked={inclusions.led}
            onChange={(e) => setInclusions({ ...inclusions, led: e.target.checked })}
            className="accent-[#B08D2C] h-4 w-4 border-[#E0D8C3] rounded-sm"
          />
          LED Screen (20x10)
        </label>
        <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold select-none">
          <input
            type="checkbox"
            checked={inclusions.catering}
            onChange={(e) => setInclusions({ ...inclusions, catering: e.target.checked })}
            className="accent-[#B08D2C] h-4 w-4 border-[#E0D8C3] rounded-sm"
          />
          Gourmet Catering
        </label>
      </div>
    </div>
  );
};

export default CoreInclusions;
