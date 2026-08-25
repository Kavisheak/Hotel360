"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { decoratorAPI } from '@/lib/api';
import RequestCard from './RequestCard';
import Footer from '../my_jobs/Footer';

const BookingsMain: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Pending");

  useEffect(() => {
    fetchRequests();
  }, [activeFilter]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await decoratorAPI.getPendingRequests(activeFilter);
      if (res.ok && res.data?.data) {
        setRequests(res.data.data);
      } else {
        setRequests([]);
      }
    } catch (e) {
      console.error("Failed to fetch requests:", e);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (id: string, advanceAmount?: number, advanceDeadline?: string) => {
    const prevRequests = [...requests];
    setRequests((prev) => prev.filter((r) => r._id !== id));

    try {
      const res = await decoratorAPI.acceptRequest(id, advanceAmount, advanceDeadline);
      if (!res.ok) {
        setRequests(prevRequests);
      }
      return { ok: res.ok, status: res.status, data: res.data };
    } catch (err: any) {
      setRequests(prevRequests);
      return { ok: false, status: 500, data: { message: err.message } };
    }
  };

  const handleDeclineRequest = async (id: string, reason: string) => {
    const prevRequests = [...requests];
    setRequests((prev) => prev.filter((r) => r._id !== id));

    try {
      const res = await decoratorAPI.declineRequest(id, reason);
      if (!res.ok) {
        setRequests(prevRequests);
      }
      return { ok: res.ok, status: res.status, data: res.data };
    } catch (err: any) {
      setRequests(prevRequests);
      return { ok: false, status: 500, data: { message: err.message } };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1] font-sans">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-serif italic text-[#A6955C]">Decorator Response Center</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 font-bold tracking-tight leading-none mt-1">
              Booking Requests
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-2 max-w-2xl">
              Manage your event decoration requests. Review pending customer requirements or check your historically accepted and declined assignments.
            </p>
          </div>

          <button
            onClick={fetchRequests}
            disabled={isLoading}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E0D8C3] bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 rounded transition-colors shadow-xs"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-[#7C6A2E]" : "text-gray-400"} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 border-b border-[#E0D8C3] mb-6">
          {["Pending", "Accepted", "Declined"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
                activeFilter === status
                  ? "border-[#7C6A2E] text-[#7C6A2E]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {status === "Accepted" ? "Confirmed" : status === "Declined" ? "Rejected" : status}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="py-16 text-center text-sm font-serif italic text-gray-400 bg-white border border-[#E0D8C3] rounded-lg">
            Loading {activeFilter.toLowerCase()} requests...
          </div>
        ) : requests.length === 0 ? (
          /* Empty state */
          <div className="py-20 px-6 text-center bg-white border border-[#E0D8C3] rounded-lg shadow-xs flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#FEF9E8] border border-[#D4B553] flex items-center justify-center text-[#7C6A2E] mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-1">
              No {activeFilter === "Accepted" ? "Confirmed" : activeFilter === "Declined" ? "Rejected" : "Pending"} Requests
            </h3>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed">
              {activeFilter === "Pending" && "Your response queue is all clear! New booking requests from customers will appear here."}
              {activeFilter === "Accepted" && "You haven't accepted any booking requests yet."}
              {activeFilter === "Declined" && "You haven't declined any booking requests."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
              <span>{requests.length} Request(s) Awaiting Response</span>
              <span className="text-[#7C6A2E]">24-Hour Response Window Active</span>
            </div>

            <div className="grid gap-4 grid-cols-1">
              {requests.map((reqItem) => (
                <RequestCard
                  key={reqItem._id}
                  request={reqItem}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingsMain;
