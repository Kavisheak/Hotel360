"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, RefreshCw, Briefcase, Lock, Info } from 'lucide-react';
import { decoratorAPI } from '@/lib/api';
import JobCard from './JobCard';
import CalendarView from '../schedule/CalendarView';
import BlockDateModal from '../schedule/BlockDateModal';

const MyJobsMain: React.FC = () => {
  // Jobs State
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [jobs, setJobs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, pages: 1, total: 0 });
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Schedule State
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);
  const [isScheduleLoading, setIsScheduleLoading] = useState(true);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs(1);
  }, [activeTab]);

  useEffect(() => {
    fetchSchedule(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const fetchJobs = async (page: number = 1) => {
    setIsJobsLoading(true);
    try {
      const res = await decoratorAPI.getJobs(activeTab, page, 10);
      if (res.ok && res.data?.data) {
        setJobs(res.data.data);
        if (res.data.pagination) setPagination(res.data.pagination);
        setExpandedJobId(null);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setIsJobsLoading(false);
    }
  };

  const fetchSchedule = async (m: number, y: number) => {
    setIsScheduleLoading(true);
    try {
      const res = await decoratorAPI.getSchedule(m, y);
      if (res.ok && res.data?.data) {
        setScheduleItems(res.data.data);
      } else {
        setScheduleItems([]);
      }
    } catch (e) {
      console.error("Failed to fetch decorator schedule:", e);
      setScheduleItems([]);
    } finally {
      setIsScheduleLoading(false);
    }
  };

  const handleMonthChange = (m: number, y: number) => {
    setSelectedMonth(m);
    setSelectedYear(y);
  };

  const handleBlockSubmit = async (body: { startDate: string; endDate: string; reason: string }) => {
    try {
      const res = await decoratorAPI.createBlock(body);
      return { ok: res.ok, status: res.status, data: res.data };
    } catch (err: any) {
      return { ok: false, status: 500, data: { message: err.message } };
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (confirm("Are you sure you want to remove this availability block?")) {
      try {
        const res = await decoratorAPI.deleteBlock(blockId);
        if (res.ok) {
          fetchSchedule(selectedMonth, selectedYear);
        } else {
          alert(res.data?.message || "Failed to delete block.");
        }
      } catch (e: any) {
        alert(e.message || "Server error while removing block.");
      }
    }
  };

  const bookedCount = scheduleItems.filter((i) => i.type === 'booked').length;
  const blockedCount = scheduleItems.filter((i) => i.type === 'blocked').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1] font-sans">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-[1400px] mx-auto w-full">

        {/* Page Title Header */}
        <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-serif italic text-[#A6955C]">Decorator Workspace</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 font-bold tracking-tight leading-none mt-1">
              My Jobs & Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-2 max-w-2xl">
              Manage your confirmed event engagements, calendar availability, and blocked dates all in one place.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => { fetchJobs(pagination.page); fetchSchedule(selectedMonth, selectedYear); }}
              disabled={isJobsLoading || isScheduleLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E0D8C3] bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 rounded transition-colors shadow-xs"
            >
              <RefreshCw size={14} className={isJobsLoading || isScheduleLoading ? "animate-spin text-[#7C6A2E]" : "text-gray-400"} />
              Refresh Dashboard
            </button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Left Column: Calendar (Width: 35%) */}
          <div className="w-full xl:w-[35%] flex-shrink-0 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-gray-900">Studio Calendar</h2>
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-colors"
              >
                <Lock size={14} /> Block Dates
              </button>
            </div>

            <div className="bg-white border border-[#E0D8C3] rounded-lg shadow-xs overflow-hidden">
              <div className="p-3 border-b border-[#E0D8C3] flex items-center justify-between text-xs bg-[#FAF6EE]">
                <div className="flex gap-4">
                  <div>
                    <span className="text-gray-500 font-bold tracking-wider">Jobs: </span>
                    <strong className="text-gray-900">{bookedCount}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold tracking-wider">Blocks: </span>
                    <strong className="text-red-600">{blockedCount}</strong>
                  </div>
                </div>
              </div>
              
              {isScheduleLoading ? (
                <div className="py-12 text-center text-sm font-serif italic text-gray-400">
                  Loading schedule...
                </div>
              ) : (
                <div className="transform scale-[0.95] origin-top">
                  <CalendarView
                    scheduleItems={scheduleItems}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={handleMonthChange}
                    onDeleteBlock={handleDeleteBlock}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Jobs List (Width: 65%) */}
          <div className="w-full xl:w-[65%] flex-1">
            {/* Tab Filter Control */}
            <div className="flex items-center gap-2 border-b border-[#E0D8C3] mb-6 overflow-x-auto pb-px">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex items-center gap-2 px-4 py-3 font-serif text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'upcoming'
                    ? 'border-[#7C6A2E] text-[#7C6A2E] bg-white rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Calendar size={16} />
                Upcoming Jobs
                <span className={`ml-1.5 px-2 py-0.5 text-[10px] rounded-full font-sans font-bold ${
                  activeTab === 'upcoming' ? 'bg-[#7C6A2E] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {activeTab === 'upcoming' ? pagination.total : '•'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`flex items-center gap-2 px-4 py-3 font-serif text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'completed'
                    ? 'border-[#7C6A2E] text-[#7C6A2E] bg-white rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <CheckCircle2 size={16} />
                Completed
                <span className={`ml-1.5 px-2 py-0.5 text-[10px] rounded-full font-sans font-bold ${
                  activeTab === 'completed' ? 'bg-[#7C6A2E] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {activeTab === 'completed' ? pagination.total : '•'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('cancelled')}
                className={`flex items-center gap-2 px-4 py-3 font-serif text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'cancelled'
                    ? 'border-red-600 text-red-700 bg-white rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <XCircle size={16} />
                Cancelled
                <span className={`ml-1.5 px-2 py-0.5 text-[10px] rounded-full font-sans font-bold ${
                  activeTab === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {activeTab === 'cancelled' ? pagination.total : '•'}
                </span>
              </button>
            </div>

            {/* Job List / Cards View */}
            {isJobsLoading ? (
              <div className="py-16 text-center text-sm font-serif italic text-gray-400 bg-white border border-[#E0D8C3] rounded-lg">
                Loading accepted jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-16 px-6 text-center bg-white border border-[#E0D8C3] rounded-lg shadow-xs flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FDF9F1] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E] mb-4">
                  <Briefcase size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-800 mb-1">
                  {activeTab === 'upcoming' && "No Upcoming Jobs Scheduled"}
                  {activeTab === 'completed' && "No Completed Jobs Yet"}
                  {activeTab === 'cancelled' && "No Cancelled Jobs"}
                </h3>
                <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                  {activeTab === 'upcoming' && "Accepted booking requests will appear here as active upcoming event engagements."}
                  {activeTab === 'completed' && "Events that have concluded will automatically move to this completed tab."}
                  {activeTab === 'cancelled' && "Jobs cancelled by customer or venue after acceptance will be listed here for record-keeping."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1">
                  {jobs.map((job) => {
                    if (expandedJobId && expandedJobId !== job._id) return null;
                    return (
                      <JobCard
                        key={job._id}
                        job={job}
                        onRefresh={() => fetchJobs(pagination.page)}
                        isExpanded={expandedJobId === job._id}
                        onToggleExpand={() => setExpandedJobId(expandedJobId === job._id ? null : job._id)}
                      />
                    );
                  })}
                </div>

                {/* Pagination controls */}
                {pagination.pages > 1 && (
                  <div className="flex justify-between items-center pt-4 border-t border-[#E0D8C3] text-xs">
                    <span className="text-gray-500">
                      Showing page {pagination.page} of {pagination.pages} ({pagination.total} total jobs)
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchJobs(pagination.page - 1)}
                        className="px-3 py-1.5 border border-[#E0D8C3] bg-white rounded font-bold uppercase disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => fetchJobs(pagination.page + 1)}
                        className="px-3 py-1.5 border border-[#E0D8C3] bg-white rounded font-bold uppercase disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Dates Modal */}
      <BlockDateModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onSuccess={() => fetchSchedule(selectedMonth, selectedYear)}
        onBlockSubmit={handleBlockSubmit}
      />

    </div>
  );
};

export default MyJobsMain;
