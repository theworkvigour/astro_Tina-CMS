import pagesData from '~/data/site/pages.yaml';

export interface SectionSpec {
  key: string;
  type:
    | 'hero'
    | 'hero_text'
    | 'hero_carousel'
    | 'features'
    | 'features2'
    | 'features3'
    | 'content'
    | 'steps'
    | 'steps2'
    | 'stats'
    | 'faqs'
    | 'testimonials'
    | 'pricing'
    | 'contact'
    | 'cta'
    | 'featured_products'
    | 'blog_latest'
    | 'map';
  label: string;
}

export interface PageSpec {
  slug: string;
  label: string;
  path: string;
  permalink: string;
  file: string;
  sections: SectionSpec[];
}

export const PAGES: PageSpec[] = (pagesData as PageSpec[]).length > 0
  ? (pagesData as PageSpec[])
  : [];

export const PAGE_BY_SLUG: Record<string, PageSpec> = Object.fromEntries(
  PAGES.map((p) => [p.slug, p])
);

const ALL_SECTION_TYPES = [
  'hero', 'hero_text', 'hero_carousel', 'features', 'features2', 'features3',
  'content', 'steps', 'steps2', 'stats', 'faqs', 'testimonials', 'pricing',
  'contact', 'cta', 'featured_products', 'blog_latest', 'map',
] as const;

export type SectionType = (typeof ALL_SECTION_TYPES)[number];
export const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero (image + title + actions)',
  hero_text: 'Hero Text (title + content, no image)',
  hero_carousel: 'Hero Carousel (auto-rotating slides)',
  features: 'Features Grid (icon + title + description)',
  features2: 'Features 2-Column Grid',
  features3: 'Features 3 (with image + CTA)',
  content: 'Content Section (text + image)',
  steps: 'Steps (numbered process)',
  steps2: 'Steps 2 (alternating)',
  stats: 'Statistics (numbers)',
  faqs: 'FAQs',
  testimonials: 'Testimonials',
  pricing: 'Pricing Tiers',
  contact: 'Contact Form',
  cta: 'Call to Action',
  featured_products: 'Featured Products',
  blog_latest: 'Latest Blog Posts',
  map: 'Google Map',
};
