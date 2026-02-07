export type GuideLang = 'ar' | 'en';

export interface GuidePageData {
  lang: GuideLang;
  slug: string;
  title: string;
  trustLine: string;
  description: string;
  lastUpdated: string;
  hero: {
    backgroundImageUrl?: string;
    showSearch?: boolean;
    searchPlaceholder: string;
  };
  filterPills: Array<{ key: string; label: string }>;
  quickPicks: Array<{
    label: string;
    title: string;
    note?: string;
    itemId: string;
  }>;
  table: {
    ctaLabel: string;
  };
  items: GuideItem[];
  buyingGuide: {
    heading: string;
    bullets: string[];
    note?: string;
  };
  faq: Array<{ q: string; a: string }>;
}

export interface GuideItem {
  id: string;
  rank: number;
  name: string;
  logoUrl?: string;
  imageUrl: string;
  score: {
    value: number;
    label: string;
  };
  priceRangeText?: string;
  bestFor: string;
  whyChosen: string;
  pros: string[];
  cons: string[];
  highlights?: Array<{ label: string; value: string }>;
  localInfo: {
    address?: string;
    area?: string;
    phone?: string;
    hours?: string;
    googleRatingText?: string;
  };
  links: {
    website?: string;
    maps?: string;
    booking?: string;
  };
  tags?: string[];
}
