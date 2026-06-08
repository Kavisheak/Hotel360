import React from 'react';
import { Mail, Eye, Clock3, CalendarDays } from 'lucide-react';

type BookingStatus = 'Upcoming' | 'Confirmed' | 'Completed' | 'Cancelled';

interface BookingRow {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  time: string;
  djPackage: string;
  status: BookingStatus;
}

const rows: BookingRow[] = [
  { id: 'BK-8842', customerName: 'Eleanor Vance', eventType: 'Wedding', date: 'Oct 24, 2024', time: '06:00 PM', venue: 'Estate at Rosewood', status: 'Confirmed' },
  { id: 'BK-9012', customerName: 'Marcus Thorne', eventType: 'Corporate Gala', date: 'Nov 12, 2024', time: '07:30 PM', venue: 'Skyline Lounge', status: 'Upcoming' },
  { id: 'BK-8850', customerName: 'Sienna Brooks', eventType: 'Private Celebration', date: 'Sep 30, 2024', time: '08:00 PM', venue: 'Bel-Air Residence', status: 'Completed' },
  { id: 'BK-9104', customerName: 'Amina Karim', eventType: 'Brand Launch', date: 'Nov 18, 2024', time: '09:00 PM', venue: 'Rooftop Atelier', status: 'Cancelled' },
];

const statusClasses: Record<BookingStatus, string> = {
  Upcoming: 'bg-[#FCF6E3] text-[#7C6A2E] border-[#F5EAD2]',
  Confirmed: 'bg-[#EAF0F6] text-[#3F6897] border-[#DCE6EE]',
  Completed: 'bg-[#EAF4EC] text-[#2E7A3E] border-[#D8EBD9]',
  Cancelled: 'bg-[#F6E9E9] text-[#A14E4E] border-[#E8D3D3]',
};

const BookingTable = () => {
  return (
    <article className="overflow-hidden border border-[#E0D8C3] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#9A7A10] text-left text-[10px] font-bold uppercase tracking-[0.22em] text-white">
              <th className="px-5 py-4">Booking ID</th>
              <th className="px-5 py-4">Customer Name</th>
              <th className="px-5 py-4">Event Type</th>
              <th className="px-5 py-4">Event Date</th>
              <th className="px-5 py-4">Event Time</th>
              <th className="px-5 py-4">Venue</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#EDE6D6] bg-white text-sm text-gray-700 even:bg-[#FDF9F1]">
                <td className="px-5 py-5 font-semibold text-gray-800">#{row.id}</td>
                <td className="px-5 py-5">
                  <div className="font-semibold text-gray-800">{row.customerName}</div>
                </td>
                <td className="px-5 py-5">{row.eventType}</td>
                <td className="px-5 py-5">
                  <div className="inline-flex items-center gap-2">
                    <CalendarDays size={13} className="text-[#A6955C]" />
                    <span>{row.date}</span>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <div className="inline-flex items-center gap-2">
                    <Clock3 size={13} className="text-[#A6955C]" />
                    <span>{row.time}</span>
                  </div>
                </td>
                <td className="px-5 py-5">{row.venue}</td>
                <td className="px-5 py-5">
                  <span className={`inline-flex border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${statusClasses[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <button className="grid h-10 w-10 place-items-center border border-[#E0D8C3] text-[#8C6A11] transition hover:bg-[#F3E8CA]" aria-label={`Email ${row.customerName}`}>
                      <Mail size={14} />
                    </button>
                    <button className="grid h-10 min-w-16 place-items-center border border-[#E0D8C3] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6A11] transition hover:bg-[#F3E8CA]">
                      <Eye size={14} className="mr-2" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default BookingTable;
