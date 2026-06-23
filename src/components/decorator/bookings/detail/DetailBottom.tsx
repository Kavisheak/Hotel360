"use client";

import React, { useState } from 'react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';

interface DetailBottomProps {
  booking: any;
  onRefresh: () => void;
}

const DetailBottom = ({ booking, onRefresh }: DetailBottomProps) => {
  const defaultChecklist = booking?.vendors?.decorator?.checklist || [];
  const [checklist, setChecklist] = useState<any[]>(defaultChecklist);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Sync state if booking changes
  React.useEffect(() => {
    if (booking?.vendors?.decorator?.checklist) {
      setChecklist(booking.vendors.decorator.checklist);
    }
  }, [booking]);

  const saveChecklist = async (newList: any[]) => {
    setIsUpdating(true);
    try {
      const { decoratorAPI } = await import('@/lib/api');
      const res = await decoratorAPI.updateChecklist(booking._id, newList);
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleCheck = (idx: number) => {
    const newList = [...checklist];
    newList[idx].isCompleted = !newList[idx].isCompleted;
    setChecklist(newList);
    saveChecklist(newList);
  };

  const handleDeleteTask = (idx: number) => {
    const newList = checklist.filter((_, i) => i !== idx);
    setChecklist(newList);
    saveChecklist(newList);
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newList = [...checklist, { task: newTask, isCompleted: false }];
    setChecklist(newList);
    saveChecklist(newList);
    setNewTask('');
    setIsAdding(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      {/* Gold Package Details (3/5 width on desktop) */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h3 className="text-xl font-serif font-bold text-gray-900">
              {booking.packageName || 'Custom'} Package Details
            </h3>
            <span className="text-[8px] font-bold tracking-widest border border-[#B08D2C] text-[#7C6A2E] px-2 py-0.5 uppercase">
              {booking.packageName === 'Custom' ? 'TAILORED TIER' : 'PREMIUM TIER'}
            </span>
          </div>

          <div className="space-y-5 mb-8">
            {booking.customMenuItems && booking.customMenuItems.map((item: string, i: number) => (
              <div key={i} className="flex items-start space-x-3">
                <CheckCircle2 size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{item}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Custom requested feature.
                  </p>
                </div>
              </div>
            ))}
            {(!booking.customMenuItems || booking.customMenuItems.length === 0) && (
              <div className="text-sm text-gray-500 italic">No specific decorator features outlined. Refer to client notes.</div>
            )}
          </div>
        </div>

        {/* Client Notes Box */}
        <div className="bg-[#FAF6EE] border-l-2 border-[#7C6A2E] p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-1">CLIENT NOTES</p>
          <p className="text-xs font-serif italic text-gray-600 leading-relaxed">
            “{booking.internalNote || 'No special instructions provided.'}”
          </p>
        </div>
      </div>

      {/* Team Checklist (2/5 width on desktop) */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Team Checklist
          </h3>

          <div className="space-y-4 mb-8">
            {checklist.map((item, idx) => (
              <label 
                key={idx} 
                className={`flex items-center space-x-3 select-none group ${isUpdating ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
              >
                <input 
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => toggleCheck(idx)}
                  className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-xs font-medium transition-all ${
                    item.isCompleted ? 'line-through text-gray-400 opacity-70' : 'text-gray-600 group-hover:text-gray-900'
                  }`}>
                    {item.task}
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteTask(idx); }}
                    disabled={isUpdating}
                    className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </label>
            ))}
            {checklist.length === 0 && (
              <div className="text-sm text-gray-500 italic text-center py-4">No tasks added yet.</div>
            )}
          </div>
        </div>

        {/* Add Task Input & Button */}
        {isAdding ? (
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task..."
              className="flex-1 border border-[#E0D8C3] px-3 py-2 text-xs focus:outline-none focus:border-[#B08D2C]"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button 
              onClick={handleAddTask}
              disabled={isUpdating || !newTask.trim()}
              className="bg-[#7C6A2E] text-white px-4 py-2 text-xs font-bold transition-colors disabled:opacity-50"
            >
              ADD
            </button>
            <button 
              onClick={() => { setIsAdding(false); setNewTask(''); }}
              className="border border-[#E0D8C3] text-gray-500 px-3 py-2 text-xs hover:bg-gray-50"
            >
              ✕
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase flex items-center justify-center space-x-1"
          >
            <Plus size={14} />
            <span>ADD TASK</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailBottom;
