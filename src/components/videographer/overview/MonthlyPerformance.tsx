import React from 'react';

const bars = [
  { month: 'JAN', value: '40%', tone: 'light' },
  { month: 'FEB', value: '62%', tone: 'light' },
  { month: 'MAR', value: '78%', tone: 'dark' },
  { month: 'APR', value: '55%', tone: 'light' },
  { month: 'MAY', value: '85%', tone: 'dark' },
  { month: 'JUN', value: '96%', tone: 'dark' },
];

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function MonthlyPerformance() {
<<<<<<< Updated upstream
=======
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const { ok, data } = await videographerAPI.getAssignedBookings();
        if (ok && data.success) {
          setBookings(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching performance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const monthCounts = new Array(12).fill(0);
  bookings.forEach((b: any) => {
    const date = new Date(b.date);
    const month = date.getMonth();
    monthCounts[month]++;
  });

  const now = new Date();
  const currentMonthIdx = now.getMonth();

  const sixBars = Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (currentMonthIdx - 5 + i + 12) % 12;
    return { 
      label: MONTHS[monthIdx], 
      count: monthCounts[monthIdx],
      isCurrentMonth: monthIdx === currentMonthIdx
    };
  });

  const maxBar = Math.max(...sixBars.map(b => b.count), 1);

>>>>>>> Stashed changes
  return (
    <article className="min-h-[420px] border border-[#E7DDCC] bg-[#F8F4EC] p-6 lg:p-8">
      <div className="mb-12 flex items-start justify-between gap-4">
<<<<<<< Updated upstream
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
                className={`absolute right-0 bottom-0 left-0 ${
                  bar.tone === 'dark' ? 'bg-[#6F5B00]' : 'bg-[#E6C340]'
                }`}
                style={{ height: bar.value }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[6px] bg-[#E7E1D4]" />
=======
        <h2 className="mb-2 text-[28px] font-serif text-gray-800">Monthly Bookings</h2>
        <span className="mt-2 text-[15px] font-serif text-gray-500">
          Annual View ({now.getFullYear()})
        </span>
      </div>

      <div className="flex h-[210px] items-end gap-3">
        {sixBars.map(({ label, count, isCurrentMonth }, idx) => {
          const pct = Math.round((count / maxBar) * 100);
          return (
            <div key={label + idx} className="flex flex-1 flex-col items-center group cursor-pointer relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-8 bg-[#7C6A2E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans font-bold whitespace-nowrap z-30">
                {count} Project{count !== 1 ? 's' : ''}
              </div>

              <div className={`relative h-[185px] w-full rounded-t-lg overflow-hidden border shadow-inner group-hover:bg-[#FDF9F1] transition-colors ${
                isCurrentMonth ? 'bg-[#FEF9E8] border-[#D4B553]' : 'bg-[#FAF6EE] border-[#E7DDCC]'
              }`}>
                {pct > 0 && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-700 ease-in-out group-hover:opacity-90 ${
                      isCurrentMonth
                        ? 'bg-gradient-to-t from-[#B08D2C] to-[#F0C040]'
                        : pct > 60
                        ? 'bg-gradient-to-t from-[#5E4F20] to-[#7C6A2E]'
                        : 'bg-gradient-to-t from-[#B08D2C] to-[#D4B553]'
                    }`}
                    style={{ height: `${pct}%` }}
                  />
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-widest mt-2 ${
                isCurrentMonth ? 'text-[#B08D2C] underline underline-offset-2' : 'text-[#7C6A2E]'
              }`}>{label}</span>
>>>>>>> Stashed changes
            </div>
          );
        })}
      </div>
    </article>
  );
}
