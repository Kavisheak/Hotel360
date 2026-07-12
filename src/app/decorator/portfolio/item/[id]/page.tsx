import React from 'react';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import PortfolioItemMain from '@/components/decorator/portfolio/item/PortfolioItemMain';
interface PageProps {
  params: Promise<{ id: string }>;
}

const PortfolioItemPage = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <PortfolioItemMain itemId={id} />
      </div>
    </div>
  );
};

export default PortfolioItemPage;
