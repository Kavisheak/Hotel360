"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Loader2, CheckCircle, XCircle } from "lucide-react";
import { videographerAPI } from "@/lib/api";

function statusClass(status: string = "") {
  const upper = status.toUpperCase();
  if (upper === "CONFIRMED" || upper === "ACCEPTED") return "bg-[#EAF4EC] text-[#2E7A3E] border-[#D8EBD9]";
  if (upper === "PENDING") return "bg-[#FCF6E3] text-[#7C6A2E] border-[#F5EAD2]";
  return "bg-[#EAF0F6] text-[#3F6897] border-[#DCE6EE]";
}

const UpcomingEventList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUpcomingEvents = async () => {
    try {
      const { ok, data } = await videographerAPI.getAssignedBookings();
      if (ok && data.success) {
        const mapped = data.data
          .filter((b: any) => {
<<<<<<< Updated upstream
            const status = b.vendors?.videographer?.status?.toUpperCase();
            return status !== 'COMPLETED'; // Only upcoming
=======
            const status = b.vendors?.videographer?.status;
            const isFuture = new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0));
            return status !== 'Declined' && status !== 'NotRequired' && isFuture;
>>>>>>> Stashed changes
          })
          .map((b: any) => ({
            _id: b._id,
            title: (`${b.eventType} for ${b.clientName}`).toUpperCase(),
            type: b.vendors?.videographer?.packageName || "Custom Package",
            date: new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            time: b.time || "TBD",
            venue: b.location?.address || b.location?.city || "TBD",
            status: b.vendors?.videographer?.status?.toUpperCase() || "PENDING",
            clientName: b.clientName,
            eventType: b.eventType
          }));
        setEvents(mapped);
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const handleStatusChange = (eventId: string, newStatus: string) => {
    setSelectedEventId(eventId);
    setModalStatus(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      setIsUpdating(true);
      const res = await videographerAPI.updateBookingStatus(selectedEventId, modalStatus);
      if (res.ok) {
        setShowModal(false);
        fetchUpcomingEvents();
      } else {
        alert(res.data?.message || 'Failed to update status');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Upcoming Shoots
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#7C6A2E]" />
        </div>
      ) : (
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming shoots.</p>
          ) : (
            events.map((event, index) => (
              <div
                key={index}
                className={`border p-4 hover:bg-[#FDF9F1] transition-colors ${
                  event.status === 'PENDING' ? 'border-[#C69C6D] bg-[#FCF6E3]' : 'border-[#E0D8C3]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-serif font-bold text-gray-900 text-sm">{event.title}</p>
                    <p className="text-[9px] font-bold tracking-widest text-[#A6955C] uppercase mt-0.5">{event.type}</p>
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest px-2 py-1 border shrink-0 ${statusClass(event.status)}`}>
                    {event.status}
                  </span>
                </div>

                <div className="space-y-1 mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} className="text-[#A6955C] shrink-0" />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={12} className="text-[#A6955C] shrink-0" />
                    <span>{event.venue}</span>
                  </div>

                  {event.status === 'PENDING' && (
                    <div className="flex items-center gap-2 mt-4">
                      <button 
                        onClick={() => handleStatusChange(event._id, 'Accepted')}
                        className="flex-1 bg-[#7C6A2E] hover:bg-[#685724] text-white py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleStatusChange(event._id, 'Declined')}
                        className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

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
                You are about to {modalStatus === 'Accepted' ? 'accept' : 'decline'} the request.
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
    </article>
  );
};

export default UpcomingEventList;
