<<<<<<< Updated upstream
import React from 'react';
import { Shield } from 'lucide-react';

const AccountSettings = () => {
=======
"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Loader2, Save } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { videographerAPI } from '@/lib/api';
import { validateEmail } from '@/lib/validation';

const AccountSettings = () => {
  const { user, updateUser } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    setErrors({});
    setMessage('');

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    setIsSaving(true);
    try {
      const { ok, data } = await videographerAPI.updateProfile({
        firstName,
        lastName,
        email,
      });

      if (ok && data.success) {
        setMessage('Account updated successfully!');
        if (data.data) {
          updateUser(data.data);
        }
      } else {
        setMessage(data.message || 'Failed to update account.');
      }
    } catch (error) {
      setMessage('An error occurred while saving.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

>>>>>>> Stashed changes
  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Shield size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">ACCOUNT SETTINGS</h3>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Update your account information and confirm the changes before publishing to your videographer portal.
      </p>

      {message && (
        <div className={`p-3 mb-4 text-xs font-bold tracking-wide uppercase ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Booking Email</label>
          <input
            type="email"
<<<<<<< Updated upstream
            defaultValue="a.malik@framestory.co"
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
        </div>

        <button className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase">
          Save Account Updates
=======
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({});
            }}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
          />
          {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2.5 text-xs font-bold tracking-widest transition-colors uppercase flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? 'Saving Updates...' : 'Save Account Updates'}
>>>>>>> Stashed changes
        </button>
      </div>
    </article>
  );
};

export default AccountSettings;
