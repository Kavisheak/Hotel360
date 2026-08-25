import React from 'react';
import { X, Calendar, MapPin, Clock, Package, DollarSign, User } from 'lucide-react';
import { getClientDisplayName, getPackageName, formatTimeslot, VENUE_NAME } from '@/lib/vendorUtils';

interface PendingBookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onAccept: (booking: any) => void;
  onDecline: (booking: any) => void;
}

const PendingBookingDetailsModal = ({ isOpen, onClose, booking, onAccept, onDecline }: PendingBookingDetailsModalProps) => {
  if (!isOpen || !booking) return null;

  const clientName = getClientDisplayName(booking);
  const eventDate = new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeSlot = formatTimeslot(booking);
  const packageName = getPackageName(booking, "videographer");
  
  // Try to get the offered price, fallback to string if not found or 0
  const offeredPrice = booking.pricingBreakdown?.videographerCost 
    ? `LKR ${booking.pricingBreakdown.videographerCost.toLocaleString()}` 
    : "Price Not Specified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl border border-[#E0D8C3] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E0D8C3] bg-[#FDF9F1] shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#2C1E14]">Booking Request Details</h2>
            <p className="text-sm text-[#7C6A2E] mt-1 font-bold tracking-widest uppercase">Action Required</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Left Column: Event & Client Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Event Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-[#A6955C] mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{eventDate}</p>
                      <p className="text-xs text-gray-500">Event Date</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#A6955C] mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{timeSlot}</p>
                      <p className="text-xs text-gray-500">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#A6955C] mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{VENUE_NAME}</p>
                      <p className="text-xs text-gray-500">Venue Location</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Client Details</h3>
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-[#A6955C] mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{clientName}</p>
                    <p className="text-xs text-gray-500">{booking.eventType || "Grand Wedding"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Package & Pricing */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Requested Services</h3>
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-[#A6955C] mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{packageName}</p>
                    <p className="text-xs text-gray-500">Videography Package</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Offered Price</h3>
                <div className="p-4 bg-[#FDF9F1] border border-[#E0D8C3] flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#805D3A]" />
                  <div>
                    <p className="text-lg font-bold text-[#3D3000]">{offeredPrice}</p>
                    <p className="text-xs text-[#7C6A2E]">Estimated Revenue</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Note: Accepting this request will allow you to request a mobilization advance from the manager.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#E0D8C3] bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
          <button 
            onClick={() => onDecline(booking)}
            className="px-6 py-2.5 border border-red-300 text-red-600 bg-white hover:bg-red-50 text-xs font-bold uppercase tracking-widest transition-colors w-full sm:w-auto"
          >
            Reject Booking
          </button>
          <button 
            onClick={() => onAccept(booking)}
            className="px-6 py-2.5 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-md w-full sm:w-auto"
          >
            Accept Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingBookingDetailsModal;
