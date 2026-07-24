"use client";
import React, { useEffect, useState } from 'react';
import CurrentPriority from './CurrentPriority';
import UpcomingJobs from './UpcomingJobs';
import PreparationChecklist from './PreparationChecklist';
import LastCompleted from './LastCompleted';
import { djAPI } from '@/lib/api';

interface JobQueueProps {
  externalBookings?: any[];
  loadingExternal?: boolean;
  onRefresh?: () => void;
}

const JobQueue: React.FC<JobQueueProps> = ({ externalBookings, loadingExternal, onRefresh }) => {
  const [internalBookings, setInternalBookings] = useState<any[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [manualPriorityId, setManualPriorityId] = useState<string | null>(null);

  useEffect(() => {
    if (!externalBookings) {
      fetchBookings();
    }
  }, [externalBookings]);

  const fetchBookings = async () => {
    try {
      const res = await djAPI.getAssignedBookings();
      if (res.ok && res.data?.data) {
        const sorted = res.data.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setInternalBookings(sorted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
    else fetchBookings();
  };

  const bookings = externalBookings || internalBookings;
  const loading = loadingExternal !== undefined ? loadingExternal : internalLoading;

  if (loading) {
    return <div className="text-[#7C6A2E] animate-pulse">Loading job queue...</div>;
  }

  // Active jobs are those not completed/cancelled by overall status, and DJ Artist status is not Completed
  let activeJobs = bookings.filter((b: any) => 
    b.status !== 'Completed' && 
    b.status !== 'Cancelled' && 
    b.status !== 'Rejected' &&
    b.vendors?.dj?.status !== 'Completed' &&
    b.vendors?.dj?.status !== 'Declined'
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
  const completedJobs = bookings.filter((b: any) => b.vendors?.dj?.status === 'Completed' || b.status === 'Completed');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="space-y-8">
        <div>
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Current Priority</h3>
          {currentPriority ? (
            <CurrentPriority booking={currentPriority} onRefresh={handleRefresh} />
          ) : (
            <div className="bg-white border border-[#E0D8C3] p-8 text-center text-gray-500 text-sm font-serif italic">
              No current priority jobs assigned.
            </div>
          )}
        </div>
        
        {upcomingJobs.length > 0 && (
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">Upcoming Jobs</h3>
            <div className="space-y-2">
            {upcomingJobs.map((job: any) => (
              <UpcomingJobs 
                key={job._id} 
                booking={job} 
                onRefresh={handleRefresh}
                onMakePriority={setManualPriorityId}
              />
            ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Preparation Checklist</h3>
          {currentPriority ? (
            <PreparationChecklist booking={currentPriority} onRefresh={handleRefresh} />
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
