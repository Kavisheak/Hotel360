import React from 'react';
import { Camera, CheckSquare, Square } from 'lucide-react';

const ChecklistItem = ({ text, completed }: { text: string; completed: boolean }) => {
  return (
    <div className="flex items-center space-x-3">
      {completed ? (
        <CheckSquare size={18} className="text-[#7C6A2E] shrink-0" />
      ) : (
        <Square size={18} className="text-gray-300 shrink-0" />
      )}
      <span className={`text-sm ${completed ? 'text-[#A6955C] line-through decoration-[#A6955C]' : 'text-gray-700 font-medium'}`}>
        {text}
      </span>
    </div>
  );
};

const EquipmentChecklist = () => {
  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-6 shadow-sm">
      <div className="space-y-4 mb-8">
        <ChecklistItem text="Camera Battery Verification" completed={true} />
        <ChecklistItem text="Lens & Sensor Cleaning" completed={true} />
        <ChecklistItem text="Audio Recorder Sync Test" completed={false} />
        <ChecklistItem text="Memory Card Formatting" completed={false} />
        <ChecklistItem text="Drone Flight Authorization" completed={false} />
      </div>

      <div className="pt-6 border-t border-[#E0D8C3]">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-800 uppercase mb-4">UPLOAD EVENT MEDIA</h4>
        <div className="border-2 border-dashed border-[#E0D8C3] bg-white p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <Camera size={24} className="text-[#A6955C] mb-3" />
          <p className="text-xs text-gray-500 font-medium">
            Click or drag clips and stills of<br />
            the event coverage to upload.<br />
          </p>
        </div>
      </div>

      <button className="w-full bg-[#685724] hover:bg-[#4A463B] text-white py-4 mt-6 font-semibold text-xs tracking-[0.2em] transition-colors shadow-md">
        MARK COVERAGE COMPLETE
      </button>
    </div>
  );
};

export default EquipmentChecklist;
