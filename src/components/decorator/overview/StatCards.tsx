const cards = [
  { title: "TOTAL BOOKINGS", value: "142", sub: "+12% vs last season", icon: "📅" },
  { title: "THIS MONTH", value: "18", sub: "9 Premium Gigs", icon: "📅" },
  { title: "AVERAGE RATING", value: "4.9", sub: "★★★★★", icon: "★" },
  { title: "PENDING", value: "03", sub: "2 Contracts / 1 Payment", icon: "!" },
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