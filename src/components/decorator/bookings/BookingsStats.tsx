import React from 'react';
import { Hourglass, CheckCircle2, AlertTriangle } from 'lucide-react';

const BookingsStats = ({ bookings }: { bookings: any[] }) => {
  const awaitingPrep = bookings.filter(b => b.vendors?.decorator?.status === 'Pending').length;
  const readyForSetup = bookings.filter(b => b.vendors?.decorator?.status === 'Accepted').length;
  
  // Note: Inventory alerts can be handled later, keeping static for now or set to 0.
  const inventoryAlerts = 0; 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {/* Awaiting Prep Card */}
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px]">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">AWAITING PREP</p>
          <span className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
            {awaitingPrep < 10 ? `0${awaitingPrep}` : awaitingPrep}
          </span>
        </div>
        <Hourglass size={28} className="text-[#B08D2C] opacity-75 shrink-0" />
      </div>

      {/* Ready for Setup Card */}
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px]">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">READY FOR SETUP</p>
          <span className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
            {readyForSetup < 10 ? `0${readyForSetup}` : readyForSetup}
          </span>
        </div>
        <CheckCircle2 size={28} className="text-[#5A87C7] opacity-75 shrink-0" />
      </div>

      {/* Inventory Alerts Card */}
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px]">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">INVENTORY ALERTS</p>
          <span className="text-4xl sm:text-5xl font-serif text-[#C75A5A] font-bold tracking-tight font-semibold">
            {inventoryAlerts < 10 ? `0${inventoryAlerts}` : inventoryAlerts}
          </span>
        </div>
        <AlertTriangle size={28} className="text-[#C75A5A] opacity-75 shrink-0" />
      </div>
    </div>
  );
};

export default BookingsStats;
