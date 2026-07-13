"use client";

import React, { useState } from 'react';
import { CheckCircle2, Plus, Trash2, Camera, CheckSquare } from 'lucide-react';
import { decoratorAPI } from '@/lib/api';
import { getApiImageUrl } from '@/lib/vendorUtils';

interface DetailBottomProps {
  booking?: any;
  onRefresh?: () => void;
}

const DetailBottom = ({ booking, onRefresh }: DetailBottomProps) => {
  const decoratorVendor = booking?.vendors?.decorator;
  const isJobCompleted = decoratorVendor?.status === 'Completed';

  const defaultTasks = [
    { task: 'Confirm floral arrangements & centerpieces', isCompleted: false },
    { task: 'Inspect lighting & drape installations', isCompleted: false },
    { task: 'Coordinate load-in schedule with venue', isCompleted: false },
  ];

  const initialChecklist = decoratorVendor?.checklist?.length > 0 ? decoratorVendor.checklist : defaultTasks;
  const checklistData = isJobCompleted 
    ? initialChecklist.map((item: any) => ({ ...item, isCompleted: true })) 
    : initialChecklist;
  
  const [checklist, setChecklist] = useState<any[]>(checklistData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(decoratorVendor?.completionPhotos?.length > 0);

  // Sync state if booking changes
  React.useEffect(() => {
    const decorator = booking?.vendors?.decorator;
    const isCompleted = decorator?.status === 'Completed';
    const updatedChecklist = decorator?.checklist?.length > 0 ? decorator.checklist : defaultTasks;
    setChecklist(isCompleted ? updatedChecklist.map((i: any) => ({ ...i, isCompleted: true })) : updatedChecklist);
    setUploaded(decorator?.completionPhotos?.length > 0);
  }, [booking?._id, booking?.vendors?.decorator]);

  const saveChecklist = async (newList: any[]) => {
    if (!booking?._id) return;
    setIsUpdating(true);
    try {
      const res = await decoratorAPI.updateChecklist(booking._id, newList);
      if (res.ok) {
        onRefresh?.();
      }
    } catch (e) {
      console.error(e);
      setErrorDetails("Failed to sync checklist.");
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(f => formData.append('photos', f));

    setIsUpdating(true);
    try {
      const res = await decoratorAPI.uploadCompletionPhotos(booking._id, formData);
      if (res.ok) {
        setUploaded(true);
        setSuccessDetails("Photos uploaded successfully.");
        onRefresh();
      } else {
        setErrorDetails(res.data?.message || "Failed to upload photos.");
      }
    } catch (err) {
      console.error(err);
      setErrorDetails("Failed to upload photos.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleComplete = async () => {
    const allDone = checklist.every((t: any) => t.isCompleted);
    if (!allDone) {
      setErrorDetails("Please complete all checklist items before marking the job as complete.");
      return;
    }
    if (!uploaded) {
      setErrorDetails("Please upload completion photos before marking the job as complete.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await decoratorAPI.updateBookingStatus(booking._id, "Completed");
      if (res.ok) {
        setSuccessDetails("Job marked as complete. The manager has been notified.");
        onRefresh();
      } else {
        setErrorDetails(res.data?.message || "Failed to mark as complete.");
      }
    } catch (err) {
      console.error(err);
      setErrorDetails("Failed to mark as complete.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 relative">
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
                className={`flex items-center space-x-3 select-none group ${(isUpdating || isJobCompleted) ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
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
                    disabled={isUpdating || isJobCompleted}
                    className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
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

          {!isJobCompleted && (
            <div className="mb-8">
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
          )}
          
          <div className="pt-6 border-t border-[#E0D8C3]">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-800 uppercase mb-4">COMPLETION PHOTOS</h4>
            
            {isJobCompleted && decoratorVendor?.completionPhotos?.length > 0 ? (
              <div className="border border-[#E0D8C3] p-2 bg-gray-50 flex flex-wrap gap-2">
                {decoratorVendor.completionPhotos.map((photo: string, i: number) => (
                  <img key={i} src={getApiImageUrl(photo)} alt="Completion" className="w-24 h-24 object-cover border border-[#E0D8C3]" />
                ))}
              </div>
            ) : (
              <label className="block">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={isUpdating} />
                <div 
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
              </label>
            )}
          </div>
        </div>

        {!isJobCompleted && (
          <button 
            onClick={handleComplete}
            disabled={isUpdating}
            className="w-full bg-[#685724] hover:bg-[#4A463B] disabled:opacity-50 text-white py-4 mt-6 font-semibold text-xs tracking-[0.2em] transition-colors shadow-md"
          >
            {isUpdating ? 'PROCESSING...' : 'MARK JOB COMPLETE'}
          </button>
        )}
      </div>

      {/* Premium Success Modal */}
      {successDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckSquare size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Success</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {successDetails}
            </p>
            <button 
              onClick={() => setSuccessDetails(null)}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Premium Error Modal */}
      {errorDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-red-200 shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 tracking-wide">
              Action Required
            </h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {errorDetails}
            </p>
            <button 
              onClick={() => setErrorDetails(null)}
              className="w-full bg-white border border-[#E0D8C3] hover:bg-gray-50 text-gray-800 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailBottom;
