import React from 'react';
import { Camera, Video, CheckCircle2, Star } from 'lucide-react';
import { Calendar, CreditCard, FileText } from 'lucide-react';

const statCards = [
  { title: "TOTAL EVENTS COVERED", value: "64", sub: "+8% vs last season", icon: <Camera size={22} className="text-[#B08D2C]" /> },
  { title: "UPCOMING SHOOTS", value: "11", sub: "5 Wedding Shoots", icon: <Video size={22} className="text-[#B08D2C]" /> },
  { title: "COMPLETED PROJECTS", value: "53", sub: "98% on-time delivery", icon: <CheckCircle2 size={22} className="text-[#B08D2C]" /> },
  { title: "AVERAGE RATING", value: "4.8", sub: "★★★★★", icon: <Star size={22} className="text-[#B08D2C]" /> },
];

const activities = [
  {
    title: "STERLING-VANCE WEDDING",
    status: "CONFIRMED",
    note: "Full-day Cinematic Coverage",
    date: "JUN 24, 2026",
    icon: <Calendar size={16} />,
  },
  {
    title: "CORPORATE GALA SHOOT",
    status: "DEPOSIT PAID",
    note: "Event Highlight Reel",
    date: "JUN 02, 2026",
    icon: <CreditCard size={16} />,
  },
  {
    title: "OKAFOR ENGAGEMENT SESSION",
    status: "PENDING",
    note: "Contract Review Required",
    date: "MAY 28, 2026",
    icon: <FileText size={16} />,
  },
];

const bars = [
  { month: 'JAN', value: '40%', tone: 'light' },
  { month: 'FEB', value: '62%', tone: 'light' },
  { month: 'MAR', value: '78%', tone: 'dark' },
  { month: 'APR', value: '55%', tone: 'light' },
  { month: 'MAY', value: '85%', tone: 'dark' },
  { month: 'JUN', value: '96%', tone: 'dark' },
];

function statusClass(status: string) {
  if (status.includes("CONFIRMED")) return "bg-[#E6F4EA] text-[#2E7A3E] border-[#D7ECD8]";
  if (status.includes("DEPOSIT")) return "bg-[#F7EBD6] text-[#7C6A2E] border-[#EDE3C8]";
  if (status.includes("PENDING")) return "bg-[#FFF4E6] text-[#C27D2C] border-[#F2E4C9]";
  return "bg-[#EAF3F0] text-[#2E7A3E] border-[#DCEEE6]";
}

const OverviewMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8 mt-4">
          <p className="text-sm font-serif italic text-[#A6955C] mb-1">Videographer Dashboard</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Welcome back, A. Malik
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            Your curated itinerary for the cinematic season ahead. Track shoots, reviews, and media deliveries.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-10">
          {statCards.map((card) => (
            <div key={card.title} className="border border-[#E0D8C3] bg-[#FDF9F1] p-5 shadow-sm flex items-center justify-between min-h-[110px]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">{card.title}</p>
                <p className="text-4xl font-serif text-[#7C6A2E] font-bold tracking-tight">{card.value}</p>
                <p className="mt-2 text-[12px] text-gray-600">{card.sub}</p>
              </div>
              <div className="opacity-75 shrink-0">{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="mt-0 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          {/* Monthly Projects Bar Chart */}
          <article className="min-h-[420px] border border-[#E7DDCC] bg-[#F8F4EC] p-6 lg:p-8">
            <div className="mb-12 flex items-start justify-between gap-4">
              <h2 className="mb-2 text-[28px] font-serif text-gray-800">Monthly Projects</h2>
              <button className="mt-2 inline-flex items-center gap-3 text-[15px] font-serif text-gray-800">
                Annual View (2026)
                <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center">
                  <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </div>
            <div className="flex h-[210px] items-end gap-5">
              {bars.map((bar) => (
                <div key={bar.month} className="flex flex-1 flex-col items-center gap-3">
                  <div className="relative h-[185px] w-full bg-[#DDD6C8]">
                    <div
                      className={`absolute right-0 bottom-0 left-0 ${bar.tone === 'dark' ? 'bg-[#6F5B00]' : 'bg-[#E6C340]'}`}
                      style={{ height: bar.value }}
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[6px] bg-[#E7E1D4]" />
                  </div>
                  <span className="text-[28px] leading-none tracking-[0.08em] text-[#181818]">{bar.month}</span>
                </div>
              ))}
            </div>
          </article>

          {/* Recent Activity */}
          <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
            <h2 className="mb-2 text-[28px] font-serif text-gray-800">Recent Activity</h2>
            <div className="mt-5 space-y-4">
              {activities.map((activity) => (
                <div key={activity.title} className="flex items-start gap-4 border-b border-[#E0D8C3] pb-4 last:border-b-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[#E0D8C3] bg-[#F2EADA] text-[#7C6A2E]">
                    {activity.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-800">{activity.title}</p>
                      <span className={`whitespace-nowrap border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${statusClass(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-gray-500">{activity.note}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-gray-400">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 transition hover:text-[#7C6A2E]">
              View all activity
            </button>
          </article>
        </div>

        {/* Spotlight Banner */}
        <div className="mt-10">
          <section className="relative overflow-hidden border border-[#E0D8C3] bg-[#3E2D16] text-white">
            <div className="absolute inset-0 bg-black/10" />
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1400&q=80')" }}
            />
            <div className="relative flex min-h-[190px] flex-col justify-end p-8 md:max-w-[70%]">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[#D7B85F]">Featured Portfolio</p>
              <h3 className="max-w-xl font-serif text-[32px] leading-tight">
                Your Summer Wedding Showreel is Ready.
              </h3>
              <button className="mt-5 w-fit bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2A2112] transition hover:bg-[#F6E9C6]">
                Download Showreel
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OverviewMain;
