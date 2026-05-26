import React from 'react';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import PortfolioHeader from '@/components/decorator/portfolio/PortfolioHeader';
import PortfolioFilters from '@/components/decorator/portfolio/PortfolioFilters';
import CategoryGallery from '@/components/decorator/portfolio/CategoryGallery';
import Footer from '@/components/decorator/my_jobs/Footer';
import { categories } from '@/components/decorator/portfolio/portfolioData';

interface PageProps {
  params: Promise<{ category: string }>;
}

const CategoryPage = async ({ params }: PageProps) => {
  const { category } = await params;

  // Validate slug exists
  const isValid = categories.some((c) => c.slug === category);
  if (!isValid) notFound();

  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0 flex flex-col">
        <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
          <PortfolioHeader />
          <PortfolioFilters />
          <CategoryGallery categorySlug={category} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CategoryPage;

// Pre-generate all valid category slugs at build time
export async function generateStaticParams() {
  return categories
    .filter((c) => c.slug !== 'all')
    .map((c) => ({ category: c.slug }));
}
