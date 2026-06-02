"use client";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6EE] font-sans text-[#1A1512]">
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  );
}
