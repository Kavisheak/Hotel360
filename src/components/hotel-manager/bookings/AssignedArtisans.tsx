import React from 'react';

const AssignedArtisans = ({ booking }: { booking: any }) => {
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

    return {
      role,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
      email: user.email,
      phone: user.phone,
      status: vendorObj.status || 'Pending',
      packageName: vendorObj.packageName || 'Custom',
      img: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100', // Default placeholder
    };
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
                  a.status === 'Declined' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {a.status}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#B08D2C] bg-[#FDF9F1] border border-[#E0D8C3] px-2 py-1 rounded-sm">
                  {a.packageName}
                </span>
              </div>
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
