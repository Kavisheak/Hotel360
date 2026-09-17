import React from "react";
import { Lock, AlertCircle, X, Loader2 } from "lucide-react";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isResetting?: boolean;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isResetting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isResetting ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border border-[#E0D8C3] shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header Bar */}
        <div className="h-1.5 w-full bg-[#B08D2C]" />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-[#B08D2C] border border-amber-100">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900">
                Reset Password
              </h3>
            </div>
            <button 
              onClick={onClose}
              disabled={isResetting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="pl-13 text-sm text-gray-600 leading-relaxed">
            Are you sure you want to reset this user's password? A <strong>new temporary random password</strong> will be generated and they will be forced to change it on their next login.
          </div>
          
          <div className="mt-8 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isResetting}
              className="px-5 py-2.5 text-xs font-bold tracking-widest text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors uppercase disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isResetting}
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold tracking-widest text-white bg-[#B08D2C] hover:bg-[#8e7123] transition-colors uppercase disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isResetting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Confirm Reset</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
