import React from 'react';
import type { GuidePageData } from '../../types/guide';

interface GuideHeroProps {
  guide: GuidePageData;
  onSearch?: (value: string) => void;
}

const GuideHero: React.FC<GuideHeroProps> = ({ guide, onSearch }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#111827] text-white">
      {guide.hero.backgroundImageUrl && (
        <img
          src={guide.hero.backgroundImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      <div className="relative z-10 px-8 py-16 md:px-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
          {guide.lastUpdated &&
            `${guide.lang === 'ar' ? 'آخر تحديث' : 'Last updated'}: ${guide.lastUpdated}`}
        </div>
        <h1 className="mt-6 text-3xl md:text-5xl font-black leading-tight">{guide.title}</h1>
        <p className="mt-4 text-white/80 text-sm md:text-base max-w-3xl">{guide.trustLine}</p>
        <p className="mt-3 text-white/70 text-sm md:text-base max-w-3xl">{guide.description}</p>
        {guide.hero.showSearch && (
          <div className="mt-8 flex max-w-xl items-center gap-3 rounded-full bg-white/10 px-4 py-2">
            <input
              type="text"
              placeholder={guide.hero.searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/60"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch?.((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button
              className="rounded-full bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#0f172a] hover:bg-[#16a34a] transition"
              onClick={(e) => {
                const input = (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement | null);
                onSearch?.(input?.value || '');
              }}
            >
              {guide.lang === 'ar' ? 'بحث' : 'Search'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GuideHero;
