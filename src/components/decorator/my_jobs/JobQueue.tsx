import React from 'react';
import CurrentPriority from './CurrentPriority';
import UpcomingJobs from './UpcomingJobs';
import PreparationChecklist from './PreparationChecklist';
import LastCompleted from './LastCompleted';

const JobQueue = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Current Priority</h3>
          <CurrentPriority />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpcomingJobs 
            date="18" 
            month="SEPT" 
            status="PENDING PREP" 
            title="Fatima's Walima" 
            location="ELITE BALLROOM" 
            guests="500 GUESTS" 
            progress={1} 
          />
          <UpcomingJobs 
            date="22" 
            month="SEPT" 
            status="LOGISTICS SENT" 
            title="Corporate Gala 2024" 
            location="ROOFTOP GARDEN" 
            guests="200 GUESTS" 
            progress={2} 
          />
        </div>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Preparation Checklist</h3>
          <PreparationChecklist />
        </div>
        
        <LastCompleted />
      </div>
    </div>
  );
};

export default JobQueue;
