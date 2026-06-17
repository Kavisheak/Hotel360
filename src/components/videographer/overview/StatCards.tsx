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
              {card.title}
            </p>
            <span className="text-sm font-bold text-[#7C6A2E]">{card.icon}</span>
          </div>

          <div className="mt-8">
            <p className="text-4xl leading-none font-serif text-[#7C6A2E]">
              {card.value}
            </p>
            <p className="mt-2 text-[12px] text-gray-600">
              {card.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
