import React from 'react';

const ClientInfo = ({ booking }: { booking: any }) => (
  <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm h-full">
    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4">
      Client Information
    </h4>

    <div className="mb-4">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Primary Contact</p>
      <p className="text-base font-serif font-semibold text-gray-800">{booking.clientName}</p>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Email</p>
        <p className="text-sm text-gray-700 break-all">{booking.clientEmail || 'contact@example.com'}</p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Phone</p>
        <p className="text-sm text-gray-700">{booking.clientPhone || '+94 77 123 4567'}</p>
      </div>
    </div>

    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Guest Count</p>
      <p className="text-sm text-gray-700 mb-4">{booking.guests} Guests</p>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">NIC Number</p>
        <p className="text-sm text-gray-700">{booking.nic || 'Not Provided'}</p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Address</p>
        <p className="text-sm text-gray-700">
          {booking.billingAddress ? `${booking.billingAddress}${booking.billingCity ? `, ${booking.billingCity}` : ''}` : 'Not Provided'}
        </p>
      </div>
    </div>
  </div>
);

export default ClientInfo;
