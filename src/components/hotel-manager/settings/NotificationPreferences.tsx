import React from 'react';
import { SectionTitle } from './SectionTitle';

const notifications = [
  {
    title: 'New Bookings',
    desc: 'When a client submits a new event request.',
    email: true,
    system: true,
  },
  {
    title: 'Payment Confirmations',
    desc: 'When a deposit or final payment is verified.',
    email: true,
    system: false,
  },
  {
    title: 'Schedule Changes',
    desc: 'Updates to event timings or dates.',
    email: true,
    system: true,
  },
];

const NotificationPreferences = () => (
  <div className="mb-12">
    <SectionTitle title="Notification Preferences" />
    <div className="bg-white border border-[#E0D8C3] shadow-sm">
      <div className="grid grid-cols-12 bg-[#7C6A2E] text-white px-6 py-3">
        <div className="col-span-8 text-[9px] font-bold uppercase tracking-widest">Alert Type</div>
        <div className="col-span-2 text-[9px] font-bold uppercase tracking-widest text-center">Email</div>
        <div className="col-span-2 text-[9px] font-bold uppercase tracking-widest text-center">System</div>
      </div>
      
      <div className="divide-y divide-[#E0D8C3]">
        {notifications.map((n, i) => (
          <div key={i} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-[#FDF9F1] transition-colors">
            <div className="col-span-8 pr-4">
              <h4 className="text-xs font-bold text-gray-800 mb-1">{n.title}</h4>
              <p className="text-[10px] text-gray-500">{n.desc}</p>
            </div>
            <div className="col-span-2 flex justify-center">
              <input type="checkbox" defaultChecked={n.email} className="w-4 h-4 accent-[#7C6A2E] border-[#E0D8C3]" />
            </div>
            <div className="col-span-2 flex justify-center">
              <input type="checkbox" defaultChecked={n.system} className="w-4 h-4 accent-[#7C6A2E] border-[#E0D8C3]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default NotificationPreferences;
