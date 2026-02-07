import React from 'react';
import { BadgeCheck, Crown, Leaf, MapPin, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';

type Lang = 'ar' | 'en';

interface BlogBlocksRendererProps {
  blocks: any[];
  lang: Lang;
  fallbackHtml?: string;
}

const pick = (value: any, lang: Lang) => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value?.[lang] ?? value?.ar ?? value?.en ?? '';
};

const BlogBlocksRenderer: React.FC<BlogBlocksRendererProps> = ({ blocks, lang, fallbackHtml }) => {
  if (!blocks.length && fallbackHtml) {
    return <div dangerouslySetInnerHTML={{ __html: fallbackHtml }} />;
  }

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Star,
    Sparkles,
    Crown,
    TrendingUp,
    BadgeCheck,
    Leaf,
    MapPin,
    Zap
  };

  return (
    <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
      {blocks.map((block: any) => {
        if (block.type === 'heading') {
          const Tag = (`h${block.data?.level || 2}` as keyof JSX.IntrinsicElements);
          return <Tag key={block.id} className="font-black text-[#111827]">{pick(block.data?.text, lang)}</Tag>;
        }
        if (block.type === 'paragraph') {
          return <p key={block.id} className="text-gray-600">{pick(block.data?.text, lang)}</p>;
        }
        if (block.type === 'image') {
          return (
            <figure key={block.id} className="space-y-2">
              {block.data?.url && <img src={block.data.url} alt="" className="rounded-2xl w-full object-cover" />}
              {block.data?.caption && <figcaption className="text-xs text-gray-500">{pick(block.data.caption, lang)}</figcaption>}
            </figure>
          );
        }
        if (block.type === 'gallery') {
          return (
            <div key={block.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(block.data?.urls || []).filter(Boolean).map((url: string, idx: number) => (
                <img key={`${block.id}-${idx}`} src={url} alt="" className="rounded-xl object-cover h-40 w-full" />
              ))}
            </div>
          );
        }
        if (block.type === 'map') {
          return (
            <div key={block.id} className="rounded-2xl overflow-hidden border border-[#E5E7EB]">
              {block.data?.embedUrl ? (
                <iframe
                  src={block.data.embedUrl}
                  className="w-full h-64"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="p-4 text-gray-500">Map embed URL missing</div>
              )}
            </div>
          );
        }
        if (block.type === 'video') {
          return (
            <div key={block.id} className="rounded-2xl overflow-hidden border border-[#E5E7EB]">
              {block.data?.embedUrl ? (
                <iframe
                  src={block.data.embedUrl}
                  className="w-full h-64"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="p-4 text-gray-500">Video embed URL missing</div>
              )}
            </div>
          );
        }
        if (block.type === 'cta') {
          return (
            <div key={block.id} className="rounded-2xl bg-[#E8F5EC] border border-[#D1E7D8] p-5 flex items-center justify-between gap-4">
              <div className="font-semibold text-[#0f172a]">{pick(block.data?.label, lang) || 'CTA'}</div>
              {block.data?.url && (
                <a className="rounded-full bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#0f172a]" href={block.data.url} target="_blank" rel="noreferrer">
                  {lang === 'ar' ? 'اذهب' : 'Go'}
                </a>
              )}
            </div>
          );
        }
        if (block.type === 'summary') {
          return (
            <div key={block.id} className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-5">
              <div className="font-black text-[#111827] mb-3">{pick(block.data?.title, lang) || (lang === 'ar' ? 'ملخص سريع' : 'Quick Summary')}</div>
              <ul className="list-disc ps-5 text-gray-600 space-y-1">
                {(block.data?.items || []).filter(Boolean).map((item: any, idx: number) => (
                  <li key={`${block.id}-item-${idx}`}>{pick(item, lang)}</li>
                ))}
              </ul>
            </div>
          );
        }
        if (block.type === 'comparison') {
          return (
            <div key={block.id} className="rounded-2xl border border-[#E5E7EB] overflow-hidden">
              {block.data?.title && (
                <div className="px-6 py-4 border-b border-[#E5E7EB] font-black">{pick(block.data.title, lang)}</div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F9FAFB] text-gray-500 text-xs">
                    <tr>
                      {(block.data?.headers || []).map((h: any, idx: number) => (
                        <th key={`${block.id}-h-${idx}`} className="px-4 py-3 text-start">{pick(h, lang)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(block.data?.rows || []).map((row: any[], rowIdx: number) => (
                      <tr key={`${block.id}-r-${rowIdx}`} className="border-b last:border-none">
                        {(block.data?.headers || []).map((_h: any, colIdx: number) => (
                          <td key={`${block.id}-r-${rowIdx}-${colIdx}`} className="px-4 py-3 text-gray-600">
                            {pick(row[colIdx], lang) || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        if (block.type === 'cards') {
          return (
            <div key={block.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(block.data?.cards || []).map((card: any, idx: number) => {
                const Icon = iconMap[card.icon] || Star;
                return (
                  <div key={`${block.id}-card-${idx}`} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#22C55E] font-bold mb-2">{pick(card.label, lang) || (lang === 'ar' ? 'تقييم' : 'Rating')}</div>
                      <div className="h-9 w-9 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16a34a]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="font-black text-lg text-[#111827]">{pick(card.title, lang) || '—'}</div>
                    {pick(card.note, lang) && <div className="text-xs text-gray-500 mt-2">{pick(card.note, lang)}</div>}
                  </div>
                );
              })}
            </div>
          );
        }
        if (block.type === 'guide') {
          return (
            <div key={block.id} className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm">
              <h2 className="text-xl font-black mb-4">{pick(block.data?.title, lang) || (lang === 'ar' ? 'نص الدليل' : 'Guide Content')}</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{pick(block.data?.content, lang)}</div>
            </div>
          );
        }
        if (block.type === 'faq') {
          return (
            <div key={block.id} className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="text-xl font-black mb-4">{pick(block.data?.title, lang) || (lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ')}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {(block.data?.items || []).map((item: any, idx: number) => (
                  <div key={`${block.id}-faq-${idx}`}>
                    <div className="font-semibold text-[#111827]">{pick(item.q, lang)}</div>
                    <div>{pick(item.a, lang)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default BlogBlocksRenderer;
