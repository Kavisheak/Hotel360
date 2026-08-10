"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Check, 
  Trash2, 
  CheckCheck, 
  Calendar, 
  CreditCard, 
  AlertTriangle, 
  MessageSquare, 
  Clock, 
  Sparkles,
  ChevronRight,
  X
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { notificationAPI } from "@/lib/api";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type?: "booking" | "payment" | "alert" | "system" | "review";
  read: boolean;
  link?: string;
  _id?: string;
}

interface NotificationCenterProps {
  role?: string;
  theme?: "gold" | "dark" | "default";
}



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

export default function NotificationCenter({ role, theme = "gold" }: NotificationCenterProps) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Resolve user role
  const userRole = (role || user?.role || "customer").toLowerCase().replace("-", "_");

  // Load initial notifications for user role
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (user) {
      const fetchRealNotifs = async () => {
        try {
          const res = await notificationAPI.getNotificationHistory();
          if (res.ok && res.data?.success) {
            const mapped = res.data.notifications.map((n: any) => ({
              id: n._id,
              title: n.title,
              message: n.message,
              time: n.createdAt ? timeAgo(new Date(n.createdAt)) : 'Just now',
              type: n.type === "BOOKING_UPDATE" ? "booking" : "system",
              read: n.deliveryStatus === 'read',
              link: userRole === 'customer' ? "/customer/myaccount?tab=overview" : undefined
            }));
            setNotifications(mapped);
          }
        } catch (e) {
          console.error("Failed to fetch real notifications", e);
        }
      };
      fetchRealNotifs();
    }
  }, [userRole, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    
    try {
      await notificationAPI.markNotificationRead(id);
    } catch (e) {
      console.error("Failed to mark read on server", e);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Implement API call for mark all read if needed
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const getIcon = (type?: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "review":
        return <Sparkles className="w-4 h-4 text-[#C9A84C]" />;
      case "system":
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "booking":
      default:
        return <Calendar className="w-4 h-4 text-[#7C6A2E] dark:text-[#C9A84C]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Animated Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2 rounded-full hover:bg-[#F2EADA] dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-[#7C6A2E] dark:hover:text-[#C9A84C] transition-colors focus:outline-none cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FDF9F1] dark:bg-[#121212] border-2 border-[#C9A84C]/40 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-[#E8DFC9] dark:border-zinc-800 bg-[#FAF6EE] dark:bg-[#181818] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#7C6A2E] dark:text-[#C9A84C]" />
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#805D3A] dark:text-[#C9A84C]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-[#7C6A2E] hover:text-[#5E4F20] dark:text-[#C9A84C] dark:hover:text-amber-300 flex items-center gap-1 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Read All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-[#E8DFC9] dark:border-zinc-800 bg-[#FDF9F1] dark:bg-[#121212] text-[11px] font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                filter === "all"
                  ? "border-[#C9A84C] text-[#7C6A2E] dark:text-[#C9A84C] bg-white/50 dark:bg-zinc-900/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                filter === "unread"
                  ? "border-[#C9A84C] text-[#7C6A2E] dark:text-[#C9A84C] bg-white/50 dark:bg-zinc-900/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E8DFC9]/60 dark:divide-zinc-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-gray-300 dark:text-zinc-700 mx-auto" />
                <p className="text-xs font-serif text-gray-500 dark:text-gray-400">
                  {filter === "unread" ? "No unread notifications" : "You have no notifications yet"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 transition-colors flex items-start gap-3 group relative ${
                    item.read
                      ? "bg-[#FDF9F1]/50 dark:bg-[#121212]/50 opacity-80"
                      : "bg-amber-50/40 dark:bg-amber-950/20"
                  }`}
                >
                  {/* Category Icon */}
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-[#E8DFC9] dark:border-zinc-800 shrink-0 shadow-xs mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-bold ${item.read ? "text-gray-700 dark:text-gray-300" : "text-[#1A1512] dark:text-white"}`}>
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                      )}
                    </div>
                    
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 leading-snug line-clamp-2">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500">
                        {item.time}
                      </span>

                      <div className="flex items-center gap-2">
                        {!item.read && (
                          <button
                            onClick={() => markAsRead(item.id)}
                            className="text-[10px] text-[#7C6A2E] dark:text-[#C9A84C] font-bold hover:underline flex items-center gap-0.5"
                          >
                            <Check className="w-3 h-3" /> Mark read
                          </button>
                        )}

                        {item.link && (
                          <Link
                            href={item.link}
                            onClick={() => {
                              markAsRead(item.id);
                              setIsOpen(false);
                            }}
                            className="text-[10px] text-[#805D3A] dark:text-[#C9A84C] font-bold hover:underline flex items-center gap-0.5"
                          >
                            View <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}

                        <button
                          onClick={() => removeNotification(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-0.5"
                          title="Remove"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#E8DFC9] dark:border-zinc-800 bg-[#FAF6EE] dark:bg-[#181818] flex items-center justify-between text-[10px]">
              <button
                onClick={clearAll}
                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-bold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear All
              </button>
              
              <span className="text-gray-400 font-serif italic">
                EASCCA Concierge Notifications
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
