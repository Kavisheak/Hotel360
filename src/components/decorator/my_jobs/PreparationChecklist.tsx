"use client";

import React, { useState } from 'react';
import { Camera, CheckSquare, Square } from 'lucide-react';

const PreparationChecklist = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Floral Inventory Verification", completed: true },
    { id: 2, text: "Backdrop Structure Assembly", completed: true },
    { id: 3, text: "Crystal Chandelier Testing", completed: false },
    { id: 4, text: "Linen Ironing & Placement", completed: false },
    { id: 5, text: "Spotlight Color Calibration", completed: false },
  ]);

  const [uploaded, setUploaded] = useState(false);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleUpload = () => {
    setUploaded(true);
    alert("Photos uploaded successfully for review.");
  };

  const handleComplete = () => {
    const allDone = tasks.every(t => t.completed);
    if (!allDone) {
      alert("Please complete all checklist items before marking the job as complete.");
      return;
    }
    if (!uploaded) {
      alert("Please upload completion photos before marking the job as complete.");
      return;
    }
    alert("Job marked as complete. The Concierge team has been notified.");
  };

  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-6 shadow-sm">
      <div className="space-y-4 mb-8">
        {tasks.map(task => (
          <ChecklistItem 
            key={task.id} 
            text={task.text} 
            completed={task.completed} 
            onToggle={() => toggleTask(task.id)} 
          />
        ))}
      </div>

      <div className="pt-6 border-t border-[#E0D8C3]">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-800 uppercase mb-4">UPLOAD COMPLETION PHOTOS</h4>
        <div 
          onClick={handleUpload}
          className={`border-2 border-dashed border-[#E0D8C3] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${uploaded ? 'bg-emerald-50 border-emerald-200' : 'bg-white hover:bg-gray-50'}`}
        >
          {uploaded ? (
            <>
              <CheckSquare size={24} className="text-emerald-600 mb-3" />
              <p className="text-xs text-emerald-700 font-medium">Photos uploaded successfully.</p>
            </>
          ) : (
            <>
              <Camera size={24} className="text-[#A6955C] mb-3" />
              <p className="text-xs text-gray-500 font-medium">Click or drag photos of<br/>the finished stage to<br/>upload for review.</p>
            </>
          )}
        </div>
      </div>

      <button 
        onClick={handleComplete}
        className="w-full bg-[#685724] hover:bg-[#4A463B] text-white py-4 mt-6 font-semibold text-xs tracking-[0.2em] transition-colors shadow-md"
      >
        MARK JOB COMPLETE
      </button>
    </div>
  );
};

interface ChecklistItemProps {
  text: string;
  completed: boolean;
  onToggle: () => void;
}

const ChecklistItem = ({ text, completed, onToggle }: ChecklistItemProps) => {
  return (
    <div className="flex items-center space-x-3 cursor-pointer group" onClick={onToggle}>
      {completed ? (
        <CheckSquare size={18} className="text-[#7C6A2E] shrink-0" />
      ) : (
        <Square size={18} className="text-gray-300 shrink-0 group-hover:text-[#A6955C] transition-colors" />
      )}
      <span className={`text-sm transition-colors ${completed ? 'text-[#A6955C] line-through decoration-[#A6955C]' : 'text-gray-700 font-medium group-hover:text-[#7C6A2E]'}`}>
        {text}
      </span>
    </div>
  );
};

export default PreparationChecklist;
