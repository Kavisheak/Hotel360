"use client";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0E6D0] font-sans text-[#2C1E14]">
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  );
}
