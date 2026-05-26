// Centralised portfolio data — decoration-specific images & categories

export interface PortfolioItem {
  id: string;
  category: string; // slug
  categoryLabel: string;
  src: string;
  alt: string;
  title: string;
  event: string;
  description: string;
  linkText: string;
}

export const categories = [
  { slug: 'all',           label: 'ALL WORKS' },
  { slug: 'tablescapes',   label: 'GRAND TABLE-SCAPES' },
  { slug: 'installations', label: 'FLORAL INSTALLATIONS' },
  { slug: 'lighting',      label: 'LIGHTING DESIGN' },
  { slug: 'stages',        label: 'STAGE SETUPS' },
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'p-1',
    category: 'installations',
    categoryLabel: 'FLORAL ARCHITECTURE',
    src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    alt: 'Grand golden hall aisle with rose pillars and chandeliers',
    title: 'The White Orchid Gala',
    event: 'GRAND MAJESTIC HALL',
    description: 'A seamless blend of cascading white orchids and crystals creating a regal, ethereal atmosphere for a grand ballroom celebration.',
    linkText: 'DETAILS'
  },
  {
    id: 'p-2',
    category: 'stages',
    categoryLabel: 'STAGE SETUP',
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    alt: 'Elegant nikah stage setup with pink floral pillars and gold geometric structures',
    title: 'Modern Gold Nikah',
    event: 'ELITE PLAZA',
    description: 'Minimalist geometric gold structures paired with asymmetrical floral pillars for a contemporary yet culturally rich ceremonial backdrop.',
    linkText: 'DETAILS'
  },
  {
    id: 'p-3',
    category: 'installations',
    categoryLabel: 'FLORAL ART',
    src: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    alt: 'Rich crimson dahlias close up with metallic golden leaves',
    title: 'Crimson Elegance Study',
    event: 'BOUTIQUE CONCEPT',
    description: 'A detailed exploration of dahlia textures and metallic leaf accents, showcasing the precision required for high-status floral installations.',
    linkText: 'DETAILS'
  },
  {
    id: 'p-4',
    category: 'lighting',
    categoryLabel: 'LIGHTING DESIGN',
    src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
    alt: 'Warm starlit Edison filament bulbs draped over a garden party night',
    title: 'Midnight Glow Soirée',
    event: 'PRIVATE GARDEN',
    description: 'Artistic filament installation using over 200 bespoke bulbs to illuminate a private garden terrace with a warm, starlit glow.',
    linkText: 'VIEW CASE STUDY'
  },
  {
    id: 'p-5',
    category: 'tablescapes',
    categoryLabel: 'TABLESCAPES',
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
    alt: 'Banquet dining tablescapes setting with white roses and eucalyptus',
    title: 'Heritage Banquet Curation',
    event: 'AL-SAYYED ESTATE',
    description: 'Exquisite fine bone china and customized floral runners designed to celebrate local heritage through a lens of modern luxury.',
    linkText: 'VIEW CASE STUDY'
  },
  {
    id: 'p-6',
    category: 'installations',
    categoryLabel: 'INSTALLATIONS',
    src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80',
    alt: 'Immersive suspended wisteria entrance canopy with path lights',
    title: 'The Wisteria Passage',
    event: 'GRAND FOYER',
    description: 'An immersive grand entrance featuring a suspended wisteria canopy and path lighting designed to transport guests into a floral dreamscape.',
    linkText: 'VIEW CASE STUDY'
  }
];
