import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { GuideItem, GuidePageData, GuideLang } from '../types/guide';
import { sampleGuideAr, sampleGuideEn } from '../data/guides/sample';
import GuideHero from '../components/guide/GuideHero';
import FilterPills from '../components/guide/FilterPills';
import QuickPicks from '../components/guide/QuickPicks';
import ComparisonTable from '../components/guide/ComparisonTable';
import GuideItemSection from '../components/guide/GuideItemSection';
import BuyingGuide from '../components/guide/BuyingGuide';
import FAQAccordion from '../components/guide/FAQAccordion';

const getGuide = (lang: GuideLang, slug?: string): GuidePageData | null => {
  const source = lang === 'ar' ? sampleGuideAr : sampleGuideEn;
  if (!slug || source.slug === slug) return source;
  return null;
};

const GuidePage: React.FC = () => {
  const { lang: langParam, slug } = useParams();
  const lang = (langParam === 'en' ? 'en' : 'ar') as GuideLang;
  const guide = getGuide(lang, slug);
  const [activeTag, setActiveTag] = useState('all');
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!guide) return;
    document.title = guide.title;
    const description = guide.description;
    let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [guide]);

  const labels = useMemo(
    () => ({
      table: {
        title: lang === 'ar' ? 'جدول مقارنة سريع' : 'Quick Comparison',
        rank: lang === 'ar' ? '#' : 'Rank',
        name: lang === 'ar' ? 'الاسم' : 'Name',
        score: lang === 'ar' ? 'التقييم' : 'Score',
        price: lang === 'ar' ? 'السعر' : 'Price',
        bestFor: lang === 'ar' ? 'أفضل لـ' : 'Best for'
      },
      item: {
        pros: lang === 'ar' ? 'الإيجابيات' : 'Pros',
        cons: lang === 'ar' ? 'السلبيات' : 'Cons',
        address: lang === 'ar' ? 'العنوان' : 'Address',
        area: lang === 'ar' ? 'المنطقة' : 'Area',
        phone: lang === 'ar' ? 'الهاتف' : 'Phone',
        hours: lang === 'ar' ? 'الساعات' : 'Hours',
        externalRating: lang === 'ar' ? 'تقييم خارجي' : 'External rating',
        maps: lang === 'ar' ? 'الخرائط' : 'Maps'
      },
      faq: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ',
      quickPicks: lang === 'ar' ? 'ملخص سريع للأفضل' : 'Quick Picks'
    }),
    [lang]
  );

  const filteredItems = useMemo(() => {
    if (!guide) return [];
    return guide.items.filter((item) => {
      const tagOk = activeTag === 'all' || item.tags?.includes(activeTag);
      const searchOk =
        !searchValue ||
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.bestFor.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.whyChosen.toLowerCase().includes(searchValue.toLowerCase());
      return tagOk && searchOk;
    });
  }, [guide, activeTag, searchValue]);

  const scrollToItem = (id: string) => {
    const el = itemRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlightId(id);
    window.setTimeout(() => setHighlightId(null), 1500);
  };

  const handleCta = (item: GuideItem) => {
    if (item.links.website) {
      window.open(item.links.website, '_blank', 'noopener,noreferrer');
    } else {
      scrollToItem(item.id);
    }
  };

  const handleMaps = (item: GuideItem) => {
    if (item.links.maps) {
      window.open(item.links.maps, '_blank', 'noopener,noreferrer');
    }
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-gray-500">Guide not found</div>
      </div>
    );
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      <header className="bg-[#111827] text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="font-black tracking-wide">Besiktas Guide</div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <span>الرئيسية</span>
            <span>الدليل</span>
            <span>عن الموقع</span>
          </nav>
          <div className="text-xs bg-white/10 px-3 py-1 rounded-full">{lang.toUpperCase()}</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <GuideHero
          guide={guide}
          onSearch={(value) => setSearchValue(value.trim())}
        />

        <div className="bg-[#111827] rounded-2xl px-6 py-5 text-white shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-bold">{labels.quickPicks}</div>
            <FilterPills
              pills={guide.filterPills}
              activeKey={activeTag}
              onChange={setActiveTag}
            />
            <QuickPicks picks={guide.quickPicks} onPick={scrollToItem} />
          </div>
        </div>

        <ComparisonTable
          items={filteredItems}
          ctaLabel={guide.table.ctaLabel}
          onCta={handleCta}
          labels={labels.table}
        />

        <div className="space-y-6">
          {filteredItems.map((item) => (
            <div key={item.id} ref={(el) => (itemRefs.current[item.id] = el)}>
              <GuideItemSection
                item={item}
                ctaLabel={guide.table.ctaLabel}
                highlight={highlightId === item.id}
                onPrimary={handleCta}
                onMaps={handleMaps}
                labels={labels.item}
              />
            </div>
          ))}
        </div>

        <BuyingGuide
          heading={guide.buyingGuide.heading}
          bullets={guide.buyingGuide.bullets}
          note={guide.buyingGuide.note}
        />

        <FAQAccordion items={guide.faq} heading={labels.faq} />
      </main>

      <footer className="mt-12 bg-[#111827] text-white/70">
        <div className="max-w-6xl mx-auto px-6 py-10 text-xs">
          © 2026 Besiktas City Guide. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default GuidePage;
