import React, { useState } from 'react';
import { Music, Mic2, Volume2, Plus, Trash2, Camera, CheckSquare } from 'lucide-react';
import { djAPI } from '@/lib/api';

interface DetailBottomProps {
  booking: any;
  onRefresh: () => void;
}

const DetailBottom = ({ booking, onRefresh }: DetailBottomProps) => {
  const djVendor = booking?.vendors?.dj;
  
  const defaultTasks = [
    { text: 'Confirm equipment load-in time with venue', isCompleted: true },
    { text: 'Test sound system & subwoofers on-site', isCompleted: false },
    { text: 'Prepare timeline & setlist for event planner', isCompleted: false },
    { text: 'Set up lighting rig & DMX controller', isCompleted: false },
    { text: 'Coordinate with MC / event host for cues', isCompleted: false },
  ];

  const initialChecklist = djVendor?.checklist?.length > 0 ? djVendor.checklist : defaultTasks;
  const [checklist, setChecklist] = useState(initialChecklist);
  const [newTask, setNewTask] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(djVendor?.completionPhotos?.length > 0);

  const saveChecklist = async (newList: any[]) => {
    setIsUpdating(true);
    try {
      const res = await djAPI.updateChecklist(booking._id, newList);
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setErrorDetails("Failed to sync checklist.");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleCheck = (idx: number) => {
    const newList = checklist.map((item: any, i: number) => 
      i === idx ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setChecklist(newList);
    saveChecklist(newList);
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newList = [...checklist, { task: newTask, isCompleted: false }];
    setChecklist(newList);
    setNewTask("");
    saveChecklist(newList);
  };

  const handleDeleteTask = (idx: number) => {
    const newList = checklist.filter((_: any, i: number) => i !== idx);
    setChecklist(newList);
    saveChecklist(newList);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    setUploaded(true);
    const formData = new FormData();
    files.forEach(f => formData.append('photos', f));
    
    setIsUpdating(true);
    try {
      await djAPI.uploadCompletionPhotos(booking._id, formData);
      setSuccessDetails("Photos uploaded successfully.");
      onRefresh();
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
      await djAPI.updateBookingStatus(booking._id, "Completed");
      setSuccessDetails("Job marked as complete. The Concierge team has been notified.");
      onRefresh();
    } catch (err) {
      console.error(err);
      setErrorDetails("Failed to mark as complete.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      {/* DJ Package Details */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h3 className="text-xl font-serif font-bold text-gray-900">Diamond DJ Package</h3>
            <span className="text-[8px] font-bold tracking-widest border border-[#B08D2C] text-[#7C6A2E] px-2 py-0.5 uppercase">PREMIUM TIER</span>
          </div>

          <div className="space-y-5 mb-8">
            <div className="flex items-start space-x-3">
              <Music size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">5-Hour Live DJ Performance</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Full event coverage from cocktail hour through grand exit with custom setlist curated to client preferences and guest demographics.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mic2 size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Professional MC Hosting</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Bilingual MC services including introductions, toasts, first dance announcements, and crowd engagement throughout the reception.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Volume2 size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Premium Sound & Light System</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">QSC K12.2 line array system with dual 18" subwoofers, intelligent LED wash, moving heads, and wireless uplighting package.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF6EE] border-l-2 border-[#7C6A2E] p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-1">CLIENT NOTES</p>
          <p className="text-xs font-serif italic text-gray-600 leading-relaxed">
            "Would love a mix of Bollywood classics, current hits, and Arabic pop. Please avoid hip-hop during dinner service. First dance song: 'A Thousand Years' — request a beautiful intro build-up."
          </p>
        </div>
      </div>

      {/* Event Day Checklist */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Event Day Checklist</h3>
          <div className="space-y-4 mb-8">
            {checklist.map((item: any, idx: number) => (
              <label key={idx} className="flex items-center space-x-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => toggleCheck(idx)}
                  className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-xs font-medium transition-all ${item.isCompleted ? 'line-through text-gray-400 opacity-70' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {item.task || item.text}
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
          </div>
          
          <div className="flex items-center space-x-2 mt-4 mb-8">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Add new preparation task..."
              className="flex-1 border-b border-[#E0D8C3] focus:border-[#7C6A2E] text-xs py-1.5 focus:outline-none placeholder-gray-400"
            />
            <button 
              onClick={handleAddTask}
              disabled={isUpdating || !newTask.trim()}
              className="text-[#7C6A2E] hover:bg-[#FDF9F1] p-1.5 rounded transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="pt-6 border-t border-[#E0D8C3]">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-800 uppercase mb-4">UPLOAD COMPLETION PHOTOS</h4>
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
          </div>
        </div>

        <button 
          onClick={handleComplete}
          disabled={isUpdating}
          className="w-full bg-[#685724] hover:bg-[#4A463B] disabled:opacity-50 text-white py-4 mt-6 font-semibold text-xs tracking-[0.2em] transition-colors shadow-md"
        >
          {isUpdating ? 'PROCESSING...' : 'MARK JOB COMPLETE'}
        </button>
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
