import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { superAdminAPI } from '@/lib/api';

interface RegisterStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const RegisterStaffModal = ({ isOpen, onClose, onSuccess }: RegisterStaffModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'manager'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await superAdminAPI.createStaff(formData);
      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
        setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'manager' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-[#E0D8C3] w-full max-w-md shadow-2xl animate-fadeIn rounded-sm overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E0D8C3] bg-[#FAF6EE]">
          <h3 className="text-xl font-serif font-bold text-[#7C6A2E]">Register New Staff Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors">
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
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">First Name</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Last Name</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Temporary Password</label>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">System Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#B08D2C] focus:outline-none bg-white">
                <option value="manager">Hotel Manager</option>
                <option value="decorator">Decorator</option>
                <option value="dj_artist">DJ Artist</option>
                <option value="videographer">Videographer</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-[#E0D8C3] bg-gray-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-xs font-bold uppercase tracking-widest shadow-sm transition-colors rounded-sm bg-[#7C6A2E] hover:bg-[#5E4F20] text-white disabled:opacity-50">
              {loading ? 'Registering...' : 'Register Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStaffModal;
