import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { staffData } from './staffData';

interface ChangeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeManagerModal = ({ isOpen, onClose }: ChangeManagerModalProps) => {
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null);

  if (!isOpen) return null;

  // Find all managers
  const availableManagers = staffData.filter(m => m.roleCategory === 'managers');

  const handleConfirm = () => {
    if (!selectedManagerId) return;
    alert('Lead Manager has been successfully updated.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-[#E0D8C3] w-full max-w-md shadow-2xl animate-fadeIn rounded-sm overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E0D8C3] bg-[#FAF6EE]">
          <h3 className="text-xl font-serif font-bold text-[#7C6A2E]">Assign New Lead Manager</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Select an existing manager from the directory to elevate to the Lead Manager role. They will gain primary dashboard access and approval authority.
          </p>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {availableManagers.map(manager => (
              <div 
                key={manager.id}
                onClick={() => setSelectedManagerId(manager.id)}
                className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${
                  selectedManagerId === manager.id 
                    ? 'border-[#B08D2C] bg-[#FDF9F1]' 
                    : 'border-[#E0D8C3] hover:border-[#B08D2C] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={manager.avatar} alt={manager.name} className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{manager.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{manager.roleBadge}</p>
                  </div>
                </div>
                {selectedManagerId === manager.id && (
                  <div className="w-5 h-5 rounded-full bg-[#B08D2C] flex items-center justify-center text-white">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#E0D8C3] bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!selectedManagerId}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-widest shadow-sm transition-colors rounded-sm ${
              selectedManagerId 
                ? 'bg-[#7C6A2E] hover:bg-[#5E4F20] text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Reassignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeManagerModal;
