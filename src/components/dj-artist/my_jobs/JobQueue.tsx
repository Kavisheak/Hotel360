"use client";
import React, { useEffect, useState } from 'react';
import CurrentPriority from './CurrentPriority';
import UpcomingJobs from './UpcomingJobs';
import PreparationChecklist from './PreparationChecklist';
import LastCompleted from './LastCompleted';
import { djAPI } from '@/lib/api';

const JobQueue = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualPriorityId, setManualPriorityId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await djAPI.getAssignedBookings();
      if (res.ok && res.data?.data) {
        const sorted = res.data.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setBookings(sorted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-[#7C6A2E] animate-pulse">Loading job queue...</div>;
  }

  // Active jobs are those not completed/cancelled by overall status, and DJ Artist status is not Completed
  let activeJobs = bookings.filter(b => 
    b.status !== 'Completed' && 
    b.status !== 'Cancelled' && 
    b.status !== 'Rejected' &&
    b.vendors?.dj?.status !== 'Completed'
  );
  
  if (manualPriorityId) {
    const priorityIndex = activeJobs.findIndex((b: any) => b._id === manualPriorityId);
    if (priorityIndex > -1) {
      const pJob = activeJobs.splice(priorityIndex, 1)[0];
      activeJobs = [pJob, ...activeJobs];
    }
  }
  
  const currentPriority = activeJobs[0];
  const upcomingJobs = activeJobs.slice(1);
  const completedJobs = bookings.filter(b => b.vendors?.dj?.status === 'Completed' || b.status === 'Completed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Current Priority</h3>
          {currentPriority ? (
            <CurrentPriority booking={currentPriority} />
          ) : (
            <div className="bg-white border border-[#E0D8C3] p-8 text-center text-gray-500 text-sm font-serif italic">
              No current priority jobs assigned.
            </div>
          )}
        </div>
        
        {upcomingJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingJobs.map((job) => (
              <UpcomingJobs 
                key={job._id} 
                booking={job} 
                onRefresh={fetchBookings}
                onMakePriority={setManualPriorityId}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Preparation Checklist</h3>
          {currentPriority ? (
            <PreparationChecklist booking={currentPriority} onRefresh={fetchBookings} />
          ) : (
             <div className="bg-white border border-[#E0D8C3] p-8 text-center text-gray-500 text-sm font-serif italic">
               No active checklists.
             </div>
          )}
        </div>
        
        {completedJobs.length > 0 ? (
          <LastCompleted booking={completedJobs[0]} />
        ) : (
           <div className="bg-[#4E411B] text-[#FDF9F1] p-6 text-center">
             <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">No completed jobs yet</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default JobQueue;
