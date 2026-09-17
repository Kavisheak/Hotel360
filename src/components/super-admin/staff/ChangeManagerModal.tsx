import React, { useState, useEffect } from 'react';
import { X, Check, CheckCircle2, Crown, Loader2, AlertCircle } from 'lucide-react';
import { superAdminAPI } from '@/lib/api';

interface ChangeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffData?: any[];
  onSuccess?: () => void;
}

const ChangeManagerModal = ({ isOpen, onClose, staffData = [], onSuccess }: ChangeManagerModalProps) => {
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<{ name: string; email?: string } | null>(null);

  // Find all managers dynamically
  const availableManagers = staffData.filter(m => m.role === 'manager');
  const currentLead = availableManagers.find(m => m.isLeadManager);

  // Initialize selectedManagerId to current lead or first available manager when opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessDetails(null);
      if (currentLead) {
        setSelectedManagerId(currentLead.id);
      } else if (availableManagers.length > 0) {
        setSelectedManagerId(availableManagers[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedManager = availableManagers.find(m => m.id === selectedManagerId);
  const isSelectedAlreadyLead = currentLead && selectedManagerId === currentLead.id;

  const handleConfirm = async () => {
    if (!selectedManagerId || !selectedManager) return;
    if (isSelectedAlreadyLead) {
      setError("This manager is already the active Lead Manager.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await superAdminAPI.assignLeadManager(selectedManagerId);
      if (res.ok) {
        setSuccessDetails({
          name: selectedManager.name,
          email: selectedManager.email,
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(res.data?.message || "Failed to designate lead manager. Please try again.");
      }
    } catch (err: any) {
      console.error("Assign lead manager error:", err);
      setError(err?.message || "A network error occurred while updating the lead manager.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    setSuccessDetails(null);
    setSelectedManagerId(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] w-full max-w-md shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        {successDetails ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border-2 border-[#B08D2C]/40 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 size={36} className="text-[#7C6A2E] animate-bounce" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">
              Lead Manager Designated
            </h3>
            
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              <span className="font-bold text-gray-900">{successDetails.name}</span> has been designated as the sole Lead Manager with primary operational authority over EASCCA wedding hall bookings and operations.
            </p>

            <div className="bg-[#FAF6EE] border border-[#E0D8C3] rounded-sm p-4 mb-6 text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-widest text-gray-400 text-[9px]">Designation</span>
                <span className="bg-[#7C6A2E] text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm flex items-center gap-1.5 shadow-xs">
                  <Crown size={11} className="text-[#F9DD76]" /> Lead Manager
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-widest text-gray-400 text-[9px]">Operational Scope</span>
                <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Venue Lead
                </span>
              </div>
              {successDetails.email && (
                <div className="flex justify-between items-center text-xs pt-1 border-t border-[#E0D8C3]/50">
                  <span className="font-bold uppercase tracking-widest text-gray-400 text-[9px]">Account Email</span>
                  <span className="text-gray-700 font-medium text-[11px]">{successDetails.email}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleCloseAll}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.98]"
            >
              Continue to Staff Directory
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E0D8C3] bg-[#FAF6EE]">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-[#B08D2C]" />
                <h3 className="text-xl font-serif font-bold text-[#7C6A2E]">Assign Lead Manager</h3>
              </div>
              <button 
                onClick={handleCloseAll} 
                className="text-gray-400 hover:text-gray-800 transition-colors p-1"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                Because EASCCA operates as a single premier wedding venue, exactly <strong className="text-gray-800">one manager</strong> holds the active Lead Manager role at any given time. Select a manager below to designate them as the active lead.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle size={15} className="shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {availableManagers.length > 0 ? availableManagers.map(manager => {
                  const isSelected = selectedManagerId === manager.id;
                  const isCurrent = !!manager.isLeadManager;

                  return (
                    <div 
                      key={manager.id}
                      onClick={() => {
                        setSelectedManagerId(manager.id);
                        setError(null);
                      }}
                      className={`flex items-center justify-between p-3.5 border rounded-sm cursor-pointer transition-all duration-150 ${
                        isSelected 
                          ? 'border-[#7C6A2E] bg-[#FAF6EE] shadow-xs' 
                          : 'border-[#E0D8C3] hover:border-[#B08D2C] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={manager.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80'} 
                          alt={manager.name} 
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80'; }} 
                          className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3] shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-gray-800 truncate">{manager.name}</p>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 bg-[#7C6A2E] text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
                                <Crown size={9} className="text-[#F9DD76]" /> Active Lead
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 truncate">{manager.email}</p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'bg-[#7C6A2E] text-white shadow-xs' 
                            : 'border border-gray-300 bg-gray-50'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-6 border border-dashed border-[#E0D8C3] rounded-sm bg-white">
                    <p className="text-xs text-gray-500">No managers found in the directory.</p>
                    <p className="text-[10px] text-gray-400 mt-1">Register a manager first using "Register Staff".</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-[#E0D8C3] bg-[#FAF6EE]">
              <button 
                type="button"
                onClick={handleCloseAll}
                disabled={submitting}
                className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleConfirm}
                disabled={!selectedManagerId || isSelectedAlreadyLead || submitting}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 ${
                  selectedManagerId && !isSelectedAlreadyLead && !submitting
                    ? 'bg-[#7C6A2E] hover:bg-[#5E4F20] text-white cursor-pointer shadow-md' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : isSelectedAlreadyLead ? (
                  <span>Already Active Lead</span>
                ) : (
                  <span>Confirm Designation</span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangeManagerModal;
