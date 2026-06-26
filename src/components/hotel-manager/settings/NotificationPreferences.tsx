"use client";

import React, { useState, useEffect } from 'react';
import { SectionTitle } from './SectionTitle';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';

const defaultNotifications = [
  {
    id: 'newBookings',
    title: 'New Bookings',
    desc: 'When a client submits a new event request.',
    email: true,
    system: true,
  },
  {
    id: 'paymentConfirmations',
    title: 'Payment Confirmations',
    desc: 'When a deposit or final payment is verified.',
    email: true,
    system: false,
  },
  {
    id: 'scheduleChanges',
    title: 'Schedule Changes',
    desc: 'Updates to event timings or dates.',
    email: true,
    system: true,
  },
];

const NotificationPreferences = () => {
  const { user, fetchUser, updateUser } = useAuthStore();
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  useEffect(() => {
    if (user?.notifications) {
      setNotifications(prev => prev.map(n => {
        const saved = user.notifications?.[n.id];
        if (saved) return { ...n, ...saved };
        return n;
      }));
    }
  }, [user]);

  const handleChange = (id: string, field: 'email' | 'system', value: boolean) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const notificationsMap = notifications.reduce((acc, curr) => {
      acc[curr.id] = { email: curr.email, system: curr.system };
      return acc;
    }, {} as any);

    const res = await authAPI.updateProfile({ notifications: notificationsMap });
    setIsSaving(false);
    
    if (res.ok) {
      updateUser({ notifications: notificationsMap });
      alert('Notification preferences updated!');
    } else {
      alert('Failed to update preferences.');
    }
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <SectionTitle title="Notification Preferences" />
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#7C6A2E] hover:bg-[#635525] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    <div className="bg-white border border-[#E0D8C3] shadow-sm">
      <div className="grid grid-cols-12 bg-[#7C6A2E] text-white px-6 py-3">
        <div className="col-span-8 text-[9px] font-bold uppercase tracking-widest">Alert Type</div>
        <div className="col-span-2 text-[9px] font-bold uppercase tracking-widest text-center">Email</div>
        <div className="col-span-2 text-[9px] font-bold uppercase tracking-widest text-center">System</div>
      </div>
      
      <div className="divide-y divide-[#E0D8C3]">
        {notifications.map((n) => (
          <div key={n.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-[#FDF9F1] transition-colors">
            <div className="col-span-8 pr-4">
              <h4 className="text-xs font-bold text-gray-800 mb-1">{n.title}</h4>
              <p className="text-[10px] text-gray-500">{n.desc}</p>
            </div>
            <div className="col-span-2 flex justify-center">
              <input type="checkbox" checked={n.email} onChange={(e) => handleChange(n.id, 'email', e.target.checked)} className="w-4 h-4 accent-[#7C6A2E] border-[#E0D8C3]" />
            </div>
            <div className="col-span-2 flex justify-center">
              <input type="checkbox" checked={n.system} onChange={(e) => handleChange(n.id, 'system', e.target.checked)} className="w-4 h-4 accent-[#7C6A2E] border-[#E0D8C3]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default NotificationPreferences;
