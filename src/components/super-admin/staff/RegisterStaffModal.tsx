import React, { useState } from 'react';
import { X, Check, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { superAdminAPI } from '@/lib/api';

interface RegisterStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const roleLabels: Record<string, string> = {
  manager: 'Hotel Manager',
  decorator: 'Decorator Artisan',
  dj_artist: 'DJ Artist',
  videographer: 'Cinematic Videographer',
};

const RegisterStaffModal = ({ isOpen, onClose, onSuccess }: RegisterStaffModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'manager'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successDetails, setSuccessDetails] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCloseAll = () => {
    setSuccessDetails(null);
    setError('');
    setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'manager' });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await superAdminAPI.createStaff(formData);
      if (res.ok) {
        setSuccessDetails({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          role: formData.role
        });
        if (onSuccess) onSuccess();
      } else {
        setError(res.data?.message || 'Failed to create staff account.');
      }
    } catch (err) {
      setError('An error occurred while creating the account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] w-full max-w-md shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* If Success, show Premium Celebration View */}
        {successDetails ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border-2 border-[#B08D2C]/40 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 size={36} className="text-[#7C6A2E] animate-bounce" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">
              Staff Member Provisioned
            </h3>
            
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Operational account for <span className="font-bold text-gray-900">{successDetails.name}</span> has been successfully registered into the EASCCA ecosystem.
            </p>

            {/* Credential summary box */}
            <div className="bg-[#FAF6EE] border border-[#E0D8C3] rounded-sm p-4 mb-6 text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-widest text-gray-400 text-[9px]">Assigned Role</span>
                <span className="bg-[#F9DD76] text-[#5E4F20] text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-sm">
                  {roleLabels[successDetails.role] || successDetails.role}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-widest text-gray-400 text-[9px]">Login Email</span>
                <span className="font-medium text-gray-800 font-mono text-[11px]">{successDetails.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-widest text-gray-400 text-[9px]">Access Status</span>
                <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active & Ready
                </span>
              </div>
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
              <h3 className="text-xl font-serif font-bold text-[#7C6A2E]">Register New Staff Member</h3>
              <button onClick={handleCloseAll} className="text-gray-400 hover:text-gray-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 mb-2">
                  Create a new operational account. They will receive immediate dashboard access.
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded border border-red-200 animate-shake">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">First Name</label>
                    <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-[#E0D8C3] bg-white rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Last Name</label>
                    <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border border-[#E0D8C3] bg-white rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-[#E0D8C3] bg-white rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input type="tel" placeholder="0771234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-[#E0D8C3] bg-white rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Temporary Password</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-[#E0D8C3] bg-white rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">System Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-[#E0D8C3] rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none bg-white font-medium text-gray-800">
                    <option value="manager">Hotel Manager</option>
                    <option value="decorator">Decorator</option>
                    <option value="dj_artist">DJ Artist</option>
                    <option value="videographer">Videographer</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-[#E0D8C3] bg-[#FAF6EE]">
                <button type="button" onClick={handleCloseAll} className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-sm transition-colors rounded-sm bg-[#7C6A2E] hover:bg-[#5E4F20] text-white disabled:opacity-50">
                  {loading ? 'Registering...' : 'Register Account'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterStaffModal;

