import React from "react";
import { CheckCircle, X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface PasswordResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  password?: string | null;
}

const PasswordResultModal: React.FC<PasswordResultModalProps> = ({
  isOpen,
  onClose,
  password,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border border-[#E0D8C3] shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header Bar */}
        <div className="h-1.5 w-full bg-green-500" />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 border border-green-100">
                <CheckCircle size={20} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900">
                Password Reset Successful
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="pl-13 text-sm text-gray-600 leading-relaxed mb-4">
            The password has been securely reset. An email has been sent to the user with these details.
          </div>
          
          {password && (
            <div className="pl-13 mt-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Temporary Password</p>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3">
                <span className="font-mono text-lg font-bold tracking-wider text-gray-800">{password}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest text-[#B08D2C] hover:bg-amber-50 rounded transition-colors uppercase"
                >
                  {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 italic">Please copy and share this securely with the user if needed.</p>
            </div>
          )}
          
          <div className="mt-8 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold tracking-widest text-white bg-green-600 hover:bg-green-700 transition-colors uppercase"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResultModal;
