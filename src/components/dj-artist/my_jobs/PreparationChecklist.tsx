"use client";

import React, { useState } from 'react';
import { Camera, CheckSquare, Square } from 'lucide-react';

import { djAPI } from '@/lib/api';

interface PreparationChecklistProps {
  booking: any;
  onRefresh: () => void;
}

const PreparationChecklist = ({ booking, onRefresh }: PreparationChecklistProps) => {
  const defaultTasks = [
    { id: 1, text: "Sound System Setup & Soundcheck", completed: false },
    { id: 2, text: "Playlist & Request List Review", completed: false },
    { id: 3, text: "Backup Console & Media Verification", completed: false },
    { id: 4, text: "DJ Booth & Lighting Rig Setup", completed: false },
    { id: 5, text: "Wireless Microphone Range Test", completed: false },
  ];

  const vendorChecklist = booking.vendors?.dj?.checklist;
  
  const initialTasks = vendorChecklist && vendorChecklist.length > 0 
    ? vendorChecklist.map((c: any, i: number) => ({ id: i, text: c.task, completed: c.isCompleted }))
    : defaultTasks;

  const [tasks, setTasks] = useState(initialTasks);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploaded, setUploaded] = useState(booking.vendors?.dj?.completionPhotos?.length > 0);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);

  React.useEffect(() => {
    const updatedChecklist = booking.vendors?.dj?.checklist;
    if (updatedChecklist && updatedChecklist.length > 0) {
      setTasks(updatedChecklist.map((c: any, i: number) => ({ id: i, text: c.task, completed: c.isCompleted })));
    } else {
      setTasks(defaultTasks);
    }
    setUploaded(booking.vendors?.dj?.completionPhotos?.length > 0);
  }, [booking._id, booking.vendors?.dj?.checklist, booking.vendors?.dj?.completionPhotos]);

  const toggleTask = async (id: number) => {
    const newTasks = tasks.map((t: any) => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);
    
    // Save to backend immediately
    try {
      const payload = newTasks.map((t: any) => ({ task: t.text, isCompleted: t.completed }));
      await djAPI.updateChecklist(booking._id, payload);
      onRefresh(); // trigger parent refresh to update progress bar
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setPhotoFiles(files);
    const formData = new FormData();
    files.forEach(f => formData.append('photos', f));

    setIsUpdating(true);
    try {
      const res = await djAPI.uploadCompletionPhotos(booking._id, formData);
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
    const allDone = tasks.every((t: any) => t.completed);
    if (!allDone) {
      setErrorDetails("Please complete all checklist items before marking the job as complete.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await djAPI.updateBookingStatus(booking._id, "Completed");
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
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-6 shadow-sm">
      <div className="space-y-4 mb-8">
        {tasks.map((task: any) => (
          <ChecklistItem 
            key={task.id} 
            text={task.text} 
            completed={task.completed} 
            onToggle={() => toggleTask(task.id)} 
          />
        ))}
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
