import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface UpcomingJobsProps {
  booking: any;
  onRefresh?: () => void;
  onMakePriority?: (id: string) => void;
}

const UpcomingJobs = ({ booking, onRefresh, onMakePriority }: UpcomingJobsProps) => {
  const dateObj = new Date(booking.date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const status = booking.vendors?.dj?.status === 'NotRequired' ? booking.status : booking.vendors?.dj?.status || 'Pending';
  const isPending = status === 'Pending';
  
  const [showModal, setShowModal] = React.useState(false);
  const [modalStatus, setModalStatus] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setModalStatus(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      setIsUpdating(true);
      const { djAPI } = await import('@/lib/api');
      const res = await djAPI.updateBookingStatus(booking._id, modalStatus);
      if (res.ok) {
        setShowModal(false);
        if (onRefresh) onRefresh();
      } else {
        alert(res.data?.message || 'Failed to update status');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Convert progress % to 0, 1, 2, 3 scale for dots
  const progressPercent = booking.vendors?.dj?.progress || 0;
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
                onClick={() => handleStatusChange('Declined')}
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
          href={`/dj-artist/events-bookings/${booking._id}`}
          className="flex items-center space-x-1 text-[10px] font-bold tracking-widest text-gray-400 hover:text-[#7C6A2E] transition-colors uppercase shrink-0"
        >
          <span>Details</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modalStatus === 'Accepted' ? 'bg-[#7C6A2E]/10 text-[#7C6A2E]' : 'bg-red-50 text-red-500'}`}>
                {modalStatus === 'Accepted' ? <CheckCircle size={32} /> : <XCircle size={32} />}
             </div>
             <h3 className="text-2xl font-serif text-gray-800 tracking-tight mb-2">
               {modalStatus === 'Accepted' ? 'Accept Event Request?' : 'Decline Event Request?'}
             </h3>
             <p className="text-sm text-gray-500 mb-8 leading-relaxed">
               You are about to {modalStatus === 'Accepted' ? 'accept' : 'decline'} the request for <strong className="text-gray-800">{booking.clientName}'s {booking.eventType}</strong>. 
               {modalStatus === 'Accepted' ? ' This will notify the manager that you are confirmed.' : ' This action cannot be undone.'}
             </p>
             <div className="flex w-full gap-3">
               <button 
                 onClick={() => setShowModal(false)}
                 disabled={isUpdating}
                 className="flex-1 border border-[#E0D8C3] text-gray-500 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmStatusChange}
                 disabled={isUpdating}
                 className={`flex-1 py-3 text-white text-xs font-bold tracking-widest uppercase transition-colors flex justify-center items-center ${
                   modalStatus === 'Accepted' ? 'bg-[#7C6A2E] hover:bg-[#685724]' : 'bg-red-500 hover:bg-red-600'
                 }`}
               >
                 {isUpdating ? (
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   `Confirm ${modalStatus}`
                 )}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingJobs;
