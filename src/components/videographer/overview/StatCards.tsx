<<<<<<< Updated upstream
const cards = [
  { title: "TOTAL EVENTS COVERED", value: "64", sub: "+8% vs last season", icon: "🎬" },
  { title: "UPCOMING SHOOTS", value: "11", sub: "5 Wedding Shoots", icon: "📅" },
  { title: "COMPLETED PROJECTS", value: "53", sub: "On-time delivery rate: 98%", icon: "✅" },
  { title: "AVERAGE RATING", value: "4.8", sub: "★★★★★", icon: "★" },
];

export default function StatCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="border border-[#E0D8C3] bg-[#FDF9F1] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="max-w-[130px] text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
=======
import { useState, useEffect } from "react";
import { videographerAPI } from "@/lib/api";
import { Loader2, Camera, Video, CheckCircle2, Star } from "lucide-react";

export default function StatCards() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcoming: 0,
    completed: 0,
    avgRating: 0 
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, ratingsRes] = await Promise.all([
          videographerAPI.getAssignedBookings(),
          videographerAPI.getRatings()
        ]);

        let total = 0;
        let upcoming = 0;
        let completed = 0;
        
        if (bookingsRes.ok && bookingsRes.data.success) {
          const bookings = bookingsRes.data.data;
          total = bookings.length;
          bookings.forEach((b: any) => {
            const status = b.vendors?.videographer?.status?.toUpperCase();
            if (status === 'COMPLETED') completed++;
            else if (status === 'ACCEPTED' || status === 'CONFIRMED' || status === 'PENDING') upcoming++;
          });
        }

        let avgRating = 0;
        if (ratingsRes.ok && ratingsRes.data.success && ratingsRes.data.data?.stats) {
          avgRating = ratingsRes.data.data.stats.averageRating || 0;
        }

        setStats({ totalEvents: total, upcoming, completed, avgRating });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: "TOTAL EVENTS COVERED", value: stats.totalEvents.toString(), sub: "All time bookings", icon: <Camera size={22} className="text-[#B08D2C]" /> },
    { title: "UPCOMING SHOOTS", value: stats.upcoming.toString(), sub: "Pending or Accepted", icon: <Video size={22} className="text-[#B08D2C]" /> },
    { title: "COMPLETED PROJECTS", value: stats.completed.toString(), sub: "Successfully delivered", icon: <CheckCircle2 size={22} className="text-[#B08D2C]" /> },
    { title: "AVERAGE RATING", value: stats.avgRating > 0 ? stats.avgRating.toString() : "N/A", sub: stats.avgRating > 0 ? "★★★★★" : "No ratings yet", icon: <Star size={22} className="text-[#B08D2C]" /> },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="group border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm hover:shadow-md hover:border-[#B08D2C] transition-all duration-300 flex items-center justify-between min-h-[110px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#7C6A2E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          {isLoading && (
            <div className="absolute inset-0 bg-[#FDF9F1]/50 flex items-center justify-center z-10">
              <Loader2 className="w-5 h-5 text-[#B08D2C] animate-spin" />
            </div>
          )}
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-600 transition-colors mb-3">
>>>>>>> Stashed changes
              {card.title}
            </p>
            <p className="text-4xl leading-none font-serif text-[#7C6A2E] font-bold tracking-tight">
              {card.value}
            </p>
            <p className="mt-2 text-[12px] text-gray-600 font-medium">
              {card.sub}
            </p>
          </div>
          <div className="opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10 bg-white p-3 rounded-full border border-[#E0D8C3] shadow-inner">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
