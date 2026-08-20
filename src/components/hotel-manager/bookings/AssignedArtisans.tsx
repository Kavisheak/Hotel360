import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useToastStore } from '@/store/toastStore';

const AssignedArtisans = ({ booking, onRefresh }: { booking: any, onRefresh?: () => void }) => {
  const [isRefunding, setIsRefunding] = useState(false);
  const { addToast } = useToastStore();
  // Defensive check for vendors object
  const vendors = booking?.vendors || {};

  // Safely extract populated vendor details
  const extractVendor = (vendorObj: any, role: string) => {
    if (!vendorObj || !vendorObj.vendorId) return null;
    
    // If it's populated, vendorId is an object with firstName, lastName, email, phone
    // If it's not populated, vendorId is just a string (ID)
    let user = typeof vendorObj.vendorId === 'object' ? vendorObj.vendorId : null;
    
    // Fallback for mock string IDs from frontend cart
    if (!user && typeof vendorObj.vendorId === 'string') {
      const mockId = vendorObj.vendorId;
      user = {
        firstName: mockId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        lastName: '',
        email: `${mockId}@example.com`,
        phone: '+94 77 000 0000',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100'
      };
    }
    
    if (!user) return null;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const rawImg = user.profileImage || user.avatar || '';
    const imgUrl = rawImg 
      ? (rawImg.startsWith('http') ? rawImg : `${API_URL}${rawImg}`)
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100';

    return {
      role,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
      email: user.email,
      phone: user.phone,
      status: vendorObj.status || 'Pending',
      packageName: vendorObj.packageName || 'Custom',
      img: imgUrl,
      rejectionReason: vendorObj.rejectionReason || vendorObj.declineReason || '',
      rejectedAt: vendorObj.rejectedAt || null,
      serviceCategory: role.toLowerCase().includes('decorator') ? 'decorator' : role.toLowerCase().includes('dj') ? 'dj' : 'videographer',
    };
  };

  const handleRefund = async (itemType: string) => {
    if (!confirm('Are you sure you want to process this refund for the customer?')) return;
    setIsRefunding(true);
    try {
      const res = await apiFetch(`/api/manager/payments/bookings/${booking._id || booking.id}/items/${itemType}/refund`, {
        method: "POST"
      });
      if (res.ok) {
        addToast({ message: "Refund processed successfully.", type: "success" });
        onRefresh?.();
      } else {
        alert(res.data?.message || "Failed to process refund.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while processing the refund.");
    } finally {
      setIsRefunding(false);
    }
  };

  const activeArtisans = [
    extractVendor(vendors.decorator, 'Decorator'),
    extractVendor(vendors.dj, 'DJ / Sound'),
    extractVendor(vendors.videographer, 'Videography')
  ].filter(Boolean); // Remove nulls

  return (
    <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm mt-6">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-5">
        Assigned Artisans
      </h4>
      
      {activeArtisans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {activeArtisans.map((a: any, index: number) => (
            <div key={index} className="flex flex-col items-center text-center p-3 border border-[#E0D8C3]/50 rounded-lg hover:shadow-md transition-shadow">
              <img
                src={a.img}
                alt={a.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#E0D8C3] mb-3"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100";
                }}
              />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{a.role}</p>
              <p className="text-sm font-serif italic text-gray-700 mb-1">{a.name}</p>
              
              <div className="text-[10px] text-gray-500 mb-2">
                <p>{a.phone}</p>
                <p className="truncate max-w-[150px]">{a.email}</p>
              </div>

              <div className="flex gap-2 items-center mt-auto">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
                  a.status === 'Accepted' || a.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  a.status === 'Refunded' ? 'bg-blue-100 text-blue-700' :
                  a.status === 'Declined' || a.status === 'Refund Pending' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {a.status === 'Awaiting Hall Confirmation' ? 'Awaiting Hall' : a.status}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#B08D2C] bg-[#FDF9F1] border border-[#E0D8C3] px-2 py-1 rounded-sm">
                  {a.packageName}
                </span>
              </div>
              
              {a.status === 'Declined' && (a.rejectionReason || a.rejectedAt) && (
                <div className="mt-3 w-full bg-red-50 border border-red-100 rounded p-2 text-left">
                  <p className="text-[9px] font-bold uppercase text-red-700 mb-1">Rejection Details</p>
                  {a.rejectedAt && (
                    <p className="text-[10px] text-red-600 mb-1">Date: {new Date(a.rejectedAt).toLocaleDateString()}</p>
                  )}
                  {a.rejectionReason && (
                    <p className="text-[10px] text-red-600 italic">"{a.rejectionReason}"</p>
                  )}
                </div>
              )}
              
              {a.status === 'Refund Pending' && (
                <button
                  onClick={() => handleRefund(a.serviceCategory)}
                  disabled={isRefunding}
                  className="mt-3 w-full py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors disabled:opacity-50"
                >
                  {isRefunding ? "Processing..." : "Refund Customer"}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center bg-[#FDF9F1] border border-[#E0D8C3] rounded-lg">
          <p className="text-sm text-gray-500 font-light italic">No artisans have been assigned to this booking yet.</p>
        </div>
      )}
    </div>
  );
};

export default AssignedArtisans;
