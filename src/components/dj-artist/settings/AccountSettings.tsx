import React from 'react';
import { Shield } from 'lucide-react';

interface AccountSettingsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors?: {email?: string, phone?: string};
}

const AccountSettings = ({ formData, handleChange, errors = {} }: AccountSettingsProps) => {
  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Shield size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">ACCOUNT SETTINGS</h3>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Update your profile information and confirm the changes before publishing to your DJ portal.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Display Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Booking Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
          {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
        </div>
      </div>
    </article>
  );
};

export default AccountSettings;
