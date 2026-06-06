export interface SectionSpec {
  key: string;
  type:
    | 'hero'
    | 'hero_text'
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
    | 'blog_latest';
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

export const PAGES: PageSpec[] = [
  {
    slug: 'home',
    label: '首页 / Home',
    path: '/',
    permalink: '/',
    file: 'src/data/pages/home.yaml',
    sections: [
      { key: 'hero', type: 'hero', label: '顶部 Hero 区' },
      { key: 'features', type: 'features', label: 'Features 区块(为什么选择我们)' },
      { key: 'featured_products', type: 'featured_products', label: 'Featured Products 区块' },
      { key: 'content_workshop', type: 'features3', label: 'Workshop Content 区块' },
      { key: 'steps', type: 'steps', label: 'Steps 区块(从下单到交付)' },
      { key: 'blog_latest', type: 'blog_latest', label: 'Latest Blog 区块' },
      { key: 'faqs', type: 'faqs', label: '常见问题 FAQs' },
      { key: 'cta', type: 'cta', label: '底部 CTA 区块' },
    ],
  },
  {
    slug: 'about',
    label: '关于 / About',
    path: '/about',
    permalink: '/about',
    file: 'src/data/pages/about.yaml',
    sections: [
      { key: 'hero', type: 'hero', label: '顶部 Hero' },
      { key: 'stats', type: 'stats', label: '数据统计 Stats' },
      { key: 'features3_what_we_build', type: 'features3', label: 'What we build' },
      { key: 'features3_more', type: 'features3', label: 'More (with image)' },
      { key: 'steps2_values', type: 'steps2', label: 'Our values' },
      { key: 'steps2_milestones', type: 'steps2', label: 'Milestones' },
      { key: 'features2_locations', type: 'features2', label: 'Our locations' },
    ],
  },
  {
    slug: 'services',
    label: '服务 / Services',
    path: '/services',
    permalink: '/services',
    file: 'src/data/pages/services.yaml',
    sections: [
      { key: 'hero', type: 'hero', label: '顶部 Hero' },
      { key: 'features2_what_we_do', type: 'features2', label: 'What we do' },
      { key: 'content_service', type: 'content', label: 'Service 详情区' },
      { key: 'testimonials', type: 'testimonials', label: '客户评价 Testimonials' },
      { key: 'cta', type: 'cta', label: '底部 CTA' },
    ],
  },
  {
    slug: 'pricing',
    label: '价格 / Pricing',
    path: '/pricing',
    permalink: '/pricing',
    file: 'src/data/pages/pricing.yaml',
    sections: [
      { key: 'hero_text', type: 'hero_text', label: '顶部 HeroText' },
      { key: 'pricing_packages', type: 'pricing', label: '服务套餐 Pricing' },
      { key: 'features3_included', type: 'features3', label: 'What you get on every build' },
      { key: 'steps_process', type: 'steps', label: 'From quote to delivery' },
      { key: 'faqs', type: 'faqs', label: 'Pricing FAQs' },
      { key: 'cta', type: 'cta', label: '底部 CTA' },
    ],
  },
  {
    slug: 'contact',
    label: '联系 / Contact',
    path: '/contact',
    permalink: '/contact',
    file: 'src/data/pages/contact.yaml',
    sections: [
      { key: 'hero_text', type: 'hero_text', label: '顶部 HeroText' },
      { key: 'contact_form', type: 'contact', label: '联系表单 Contact' },
      { key: 'features2_other_ways', type: 'features2', label: 'Other ways to reach us' },
    ],
  },
];

export const PAGE_BY_SLUG: Record<string, PageSpec> = Object.fromEntries(
  PAGES.map((p) => [p.slug, p])
);
