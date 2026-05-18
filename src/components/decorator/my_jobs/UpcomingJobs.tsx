import React from 'react';

interface UpcomingJobsProps {
  date: string;
  month: string;
  status: string;
  title: string;
  location: string;
  guests: string;
  progress: number;
}

const UpcomingJobs = ({ date, month, status, title, location, guests, progress }: UpcomingJobsProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-[#4A463B] text-white w-12 h-14 flex flex-col justify-center items-center">
          <span className="text-lg font-bold font-serif leading-none">{date}</span>
          <span className="text-[8px] font-bold tracking-widest">{month}</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{status}</span>
      </div>

      <div>
        <h3 className="text-2xl font-serif text-gray-800 tracking-tight leading-tight mb-2">{title}</h3>
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">
          <span>{location}</span>
          <span>·</span>
          <span>{guests}</span>
        </div>
      </div>
      
      <div className="flex space-x-1 mt-auto pt-4">
        {[0, 1, 2].map((i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i < progress ? 'bg-[#7C6A2E]' : 'bg-[#E0D8C3]'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingJobs;
