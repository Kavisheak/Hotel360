import React from "react";

type SummaryCard = {
  title: string;
  value: string;
  sub: string;
  icon: string;
};

const cards: SummaryCard[] = [
  { title: "TOTAL EVENTS PERFORMED", value: "142", sub: "+12% vs last season", icon: "📅" },
  { title: "AVERAGE RATING", value: "4.9", sub: "★★★★★", icon: "★" },
  { title: "COMPLETED EVENTS", value: "126", sub: "18 events remaining", icon: "✓" },
  { title: "UPCOMING EVENTS", value: "18", sub: "9 premium gigs", icon: "⌂" },
];

export default function PerformanceSummary() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.title} className="border border-[#E0D8C3] bg-[#FDF9F1] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="max-w-[130px] text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {card.title}
            </p>
            <span className="text-sm font-bold text-[#7C6A2E]">{card.icon}</span>
          </div>

          <div className="mt-8">
            <p className="text-4xl leading-none font-serif text-[#7C6A2E]">{card.value}</p>
            <p className="mt-2 text-[12px] text-gray-600">{card.sub}</p>
          </div>
        </article>
      ))}
    </section>
  );
}