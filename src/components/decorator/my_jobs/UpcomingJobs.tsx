import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface UpcomingJobsProps {
  booking: any;
  onRefresh?: () => void;
  onMakePriority?: (id: string) => void;
}

const UpcomingJobs = ({ booking, onRefresh, onMakePriority }: UpcomingJobsProps) => {
  const dateObj = new Date(booking.date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const status = booking.vendors?.decorator?.status === 'NotRequired' ? booking.status : booking.vendors?.decorator?.status || 'Pending';
  const isPending = status === 'Pending';
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      const { decoratorAPI } = await import('@/lib/api');
      // Simulated API call (the real endpoint might be updateBookingStatus or similar)
      alert(`${newStatus} request for ${booking.clientName}'s event. (Functional Placeholder)`);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };
  
  // Convert progress % to 0, 1, 2, 3 scale for dots
  const progressPercent = booking.vendors?.decorator?.progress || 0;
  let progressDots = 0;
  if (progressPercent > 0) progressDots = 1;
  if (progressPercent >= 50) progressDots = 2;
  if (progressPercent === 100) progressDots = 3;

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-[#4A463B] text-white w-12 h-14 flex flex-col justify-center items-center">
          <span className="text-lg font-bold font-serif leading-none">{day}</span>
          <span className="text-[8px] font-bold tracking-widest">{month}</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{status}</span>
      </div>

      <div>
        <h3 className="text-2xl font-serif text-gray-800 tracking-tight leading-tight mb-2">{booking.clientName}'s {booking.eventType}</h3>
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">
          <span>EASCC GRAND BALLROOM</span>
          <span>·</span>
          <span>{booking.guests} GUESTS</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <div className="flex space-x-1">
          {isPending ? (
            <div className="flex space-x-2">
              <button 
                onClick={() => handleStatusChange('Accepted')}
                className="bg-[#7C6A2E] hover:bg-[#685724] text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                Accept
              </button>
              <button 
                onClick={() => handleStatusChange('Rejected')}
                className="border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < progressDots ? 'bg-[#7C6A2E]' : 'bg-[#E0D8C3]'}`}
                  />
                ))}
              </div>
              {onMakePriority && (
                <button 
                  onClick={() => onMakePriority(booking._id)}
                  className="text-[9px] border border-[#E0D8C3] px-2 py-0.5 text-gray-500 hover:text-[#7C6A2E] hover:border-[#7C6A2E] transition-colors font-bold tracking-widest uppercase"
                  title="Make this your current priority"
                >
                  Set Priority
                </button>
              )}
            </div>
          )}
        </div>
        <Link 
          href={`/decorator/bookings/${booking._id}`}
          className="flex items-center space-x-1 text-[10px] font-bold tracking-widest text-gray-400 hover:text-[#7C6A2E] transition-colors uppercase shrink-0"
        >
          <span>Details</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default UpcomingJobs;
