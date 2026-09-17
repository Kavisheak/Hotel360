"use client";

import React, { useState, useEffect } from 'react';
import { SectionTitle } from './SectionTitle';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { authAPI } from '@/lib/api';
import FeedbackModal from '../shared/FeedbackModal';

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
  const { addToast } = useToastStore();
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [isSaving, setIsSaving] = useState(false);

  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    badgeText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

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

    try {
      const res = await authAPI.updateProfile({ notifications: notificationsMap });
      if (res.ok) {
        updateUser({ notifications: notificationsMap });
        setFeedback({
          isOpen: true,
          title: "Preferences Recorded",
          message: "Your delivery channels for booking requests, schedule modifications, and payment alerts have been saved.",
          type: "success",
          badgeText: "Notifications Configured"
        });
        addToast({ message: "Notification preferences saved!", type: "success" });
      } else {
        setFeedback({
          isOpen: true,
          title: "Update Failed",
          message: res.data?.message || "Failed to update notification preferences.",
          type: "error"
        });
      }
    } catch (e: any) {
      setFeedback({
        isOpen: true,
        title: "Network Error",
        message: e?.message || "Failed to save preferences due to a connection issue.",
        type: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <SectionTitle title="Notification Preferences" />
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#7C6A2E] hover:bg-[#635525] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-md"
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
                <input type="checkbox" checked={n.email} onChange={(e) => handleChange(n.id, 'email', e.target.checked)} className="w-4 h-4 accent-[#7C6A2E] border-[#E0D8C3] cursor-pointer" />
              </div>
              <div className="col-span-2 flex justify-center">
                <input type="checkbox" checked={n.system} onChange={(e) => handleChange(n.id, 'system', e.target.checked)} className="w-4 h-4 accent-[#7C6A2E] border-[#E0D8C3] cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Luxury Feedback Modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback(prev => ({ ...prev, isOpen: false }))}
        title={feedback.title}
        message={feedback.message}
        type={feedback.type}
        badgeText={feedback.badgeText}
      />
    </div>
  );
};

export default NotificationPreferences;
