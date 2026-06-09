import React, { useState } from 'react';
import { Sparkles, X, Plus } from 'lucide-react';

const AISentiment = () => {
  const [threshold, setThreshold] = useState(2.5);
  const [keywords, setKeywords] = useState(['CLEANLINESS', 'PUNCTUALITY', 'AESTHETIC']);
  const [newKeyword, setNewKeyword] = useState('');
  const [notifications, setNotifications] = useState(true);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim().toUpperCase())) {
      setKeywords([...keywords, newKeyword.trim().toUpperCase()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

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
          <span className="text-sm font-serif font-bold text-gray-800">{threshold.toFixed(1)} / 5.0</span>
        </div>
        <input
          type="range"
          min="1.0"
          max="5.0"
          step="0.1"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="w-full accent-[#B08D2C] cursor-pointer"
        />
        <p className="text-[10px] text-gray-400 italic mt-2">
          Reviews below this score will automatically flag providers for audit.
        </p>
      </div>

      {/* Prioritized Keywords */}
      <div className="space-y-3">
        <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase">
          Prioritized Keywords
        </label>
        
        {/* Keywords list */}
        <div className="flex flex-wrap gap-2">
          {keywords.map(kw => (
            <span
              key={kw}
              className="bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-1.5 text-[10px] font-bold text-gray-700 tracking-wider flex items-center gap-2"
            >
              {kw}
              <button
                onClick={() => handleRemoveKeyword(kw)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleAddKeyword} className="flex border border-[#E0D8C3]">
          <input
            type="text"
            placeholder="Add keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="flex-1 bg-transparent text-xs py-2 px-3 text-gray-700 focus:outline-none placeholder-gray-400 italic font-serif"
          />
          <button type="submit" className="px-3 border-l border-[#E0D8C3] hover:bg-[#FAF6EE] text-[#7C6A2E] transition-colors">
            <Plus size={14} />
          </button>
        </form>
      </div>

      {/* Notifications Toggle */}
      <div className="border-t border-[#E0D8C3] pt-4 flex justify-between items-center">
        <span className="text-[10px] font-bold tracking-wider text-gray-600">
          Automated Manager Notifications
        </span>
        <button
          onClick={() => setNotifications(!notifications)}
          className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-none ${
            notifications ? 'bg-[#B08D2C]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
              notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
          />
        </button>
      </div>
    </div>
  );
};

export default AISentiment;
