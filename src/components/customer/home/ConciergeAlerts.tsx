"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckSquare, ArrowRight, Loader2 } from 'lucide-react';
import { accountAPI, notificationAPI } from '@/lib/api';

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");
  return "Just now";
};

export default function ConciergeAlerts() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getNotificationHistory();
      if (res.ok && res.data?.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (e) {
      console.error("Error fetching notifications:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissNotif = async (id: string) => {
    try {
      const res = await notificationAPI.markNotificationRead(id);
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      } else {
        console.error("Failed to dismiss notification:", res.data?.message);
      }
    } catch (e) {
      console.error("Error dismissing notification:", e);
    }
  };

  return (
    <>
      {/* Notifications Card */}
      <div className="bg-[#2C1E14] dark:bg-[#111111] text-white border border-[#C9A84C]/20 p-6 shadow-2xl rounded-sm hover-glow transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif text-[#C9A84C] flex items-center gap-2">
            <Bell className="w-4 h-4 animate-bounce" /> Concierge Directives
          </h3>
          {notifications.length > 0 && !loading && (
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-6 flex justify-center text-[#C9A84C]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center border-t border-white/10 text-gray-400">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-light">All caught up! No new directives.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif._id} className="pb-4 border-b border-white/10 dark:border-[#C9A84C]/20 last:border-0 last:pb-0 p-2 rounded-sm transition-colors duration-200 -mx-2 group relative">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="text-xs font-bold text-[#F0E6D0] pr-6">{notif.title}</h4>
                  <span className="text-[8px] text-gray-500 font-semibold shrink-0 uppercase tracking-wider">
                    {notif.createdAt ? timeAgo(new Date(notif.createdAt)) : 'Just now'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-light mt-1.5 leading-normal pr-4">
                  {notif.message}
                </p>
                <button 
                  onClick={() => handleDismissNotif(notif._id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all btn-interactive"
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Resources / Tips */}
      <div className="bg-[#F0E6D0] dark:bg-[#1A1512] border border-[#D4C9A8] dark:border-[#C9A84C]/20 p-5 rounded-sm hover-glow transition-all duration-300 mt-6">
        <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#C9A84C] block mb-1">Planning Guide</span>
        <h4 className="text-sm font-serif font-semibold text-gray-900 dark:text-white mb-2">Did you know?</h4>
        <p className="text-xs font-light text-gray-500 dark:text-gray-400 leading-normal">
          EASCC collaborates directly with premium verified decorators, photographers, and local florists. You can select your creative team directly through your dashboard to link culinary and setup timelines seamlessly.
        </p>
        <div className="mt-4">
          <Link 
            href="/customer/vendors"
            className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-[#C9A84C] hover:text-[#2C1E14] transition-colors"
          >
            <span>Browse Creative Vendors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
