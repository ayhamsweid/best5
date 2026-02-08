import React from 'react';
import { BadgeCheck, CheckCircle, Clock, Crown, Leaf, Map, MapPin, Phone, Sparkles, Star, TrendingUp, XCircle, Zap } from 'lucide-react';

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
    <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
      {blocks.map((block: any) => {
        if (block.type === 'heading') {
          const Tag = (`h${block.data?.level || 2}` as keyof JSX.IntrinsicElements);
          const size =
            block.data?.level === 1 ? 'text-3xl' : block.data?.level === 3 ? 'text-xl' : block.data?.level === 4 ? 'text-lg' : 'text-2xl';
          return <Tag key={block.id} className={`font-black text-[#111827] dark:text-white ${size}`}>{pick(block.data?.text, lang)}</Tag>;
        }
        if (block.type === 'paragraph') {
          return <p key={block.id} className="text-gray-600 dark:text-gray-300">{pick(block.data?.text, lang)}</p>;
        }
        if (block.type === 'image') {
          return (
            <figure key={block.id} className="space-y-2">
              {block.data?.url && <img src={block.data.url} alt="" loading="lazy" className="rounded-2xl w-full object-cover" />}
              {block.data?.caption && <figcaption className="text-xs text-gray-500">{pick(block.data.caption, lang)}</figcaption>}
            </figure>
          );
        }
        if (block.type === 'gallery') {
          return (
            <div key={block.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(block.data?.urls || []).filter(Boolean).map((url: string, idx: number) => (
                <img key={`${block.id}-${idx}`} src={url} alt="" loading="lazy" className="rounded-xl object-cover h-40 w-full" />
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
            <div key={block.id} className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-5 dark:bg-[#111827] dark:border-white/10">
              <div className="font-black text-[#111827] dark:text-white mb-3">{pick(block.data?.title, lang) || (lang === 'ar' ? 'ملخص سريع' : 'Quick Summary')}</div>
              <ul className="list-disc ps-5 text-gray-600 dark:text-gray-300 space-y-1">
                {(block.data?.items || []).filter(Boolean).map((item: any, idx: number) => (
                  <li key={`${block.id}-item-${idx}`}>{pick(item, lang)}</li>
                ))}
              </ul>
            </div>
          );
        }
        if (block.type === 'comparison') {
          return (
            <div key={block.id} className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white dark:bg-[#111827] dark:border-white/10">
              {block.data?.title && (
                <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-white/10 font-black text-[#111827] dark:text-white">{pick(block.data.title, lang)}</div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F9FAFB] text-gray-500 text-xs dark:bg-[#0f172a]">
                    <tr>
                      {(block.data?.headers || []).map((h: any, idx: number) => (
                        <th key={`${block.id}-h-${idx}`} className="px-4 py-3 text-start">{pick(h, lang)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(block.data?.rows || []).map((row: any[], rowIdx: number) => (
                      <tr key={`${block.id}-r-${rowIdx}`} className="border-b last:border-none dark:border-white/10">
                        {(block.data?.headers || []).map((_h: any, colIdx: number) => (
                          <td key={`${block.id}-r-${rowIdx}-${colIdx}`} className="px-4 py-3 text-gray-600 dark:text-gray-300">
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
            <div key={block.id} className="space-y-4">
              {block.data?.title && <div className="text-2xl font-black text-[#111827] dark:text-white">{pick(block.data.title, lang)}</div>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(block.data?.cards || []).map((card: any, idx: number) => {
                  const Icon = iconMap[card.icon] || Star;
                  return (
                    <div key={`${block.id}-card-${idx}`} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm dark:bg-[#111827] dark:border-white/10">
                      <div className="h-10 w-10 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16a34a] mb-3">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="font-black text-lg text-[#111827] dark:text-white">{pick(card.title, lang) || '—'}</div>
                      {pick(card.label, lang) && <div className="text-[#22C55E] font-bold text-sm mt-1">{pick(card.label, lang)}</div>}
                      {pick(card.note, lang) && <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{pick(card.note, lang)}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
        if (block.type === 'guide') {
          return (
            <div key={block.id} className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm dark:bg-[#111827] dark:border-white/10">
              <h2 className="text-xl font-black mb-4 text-[#111827] dark:text-white">{pick(block.data?.title, lang) || (lang === 'ar' ? 'نص الدليل' : 'Guide Content')}</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{pick(block.data?.content, lang)}</div>
            </div>
          );
        }
        if (block.type === 'faq') {
          return (
            <div key={block.id} className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm dark:bg-[#111827] dark:border-white/10">
              <h3 className="text-xl font-black mb-4 text-[#111827] dark:text-white">{pick(block.data?.title, lang) || (lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ')}</h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {(block.data?.items || []).map((item: any, idx: number) => (
                  <details key={`${block.id}-faq-${idx}`} className="group rounded-xl border border-[#F3F4F6] dark:border-white/10 px-4 py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[#111827] dark:text-white">
                      {pick(item.q, lang)}
                      <span className="text-xs text-gray-400">+</span>
                    </summary>
                    <div className="pt-3 text-gray-600 dark:text-gray-300">{pick(item.a, lang)}</div>
                  </details>
                ))}
              </div>
            </div>
          );
        }
        if (block.type === 'restaurant') {
          const title = pick(block.data?.name, lang);
          const location = pick(block.data?.location, lang);
          const description = pick(block.data?.description, lang);
          const address = pick(block.data?.address, lang);
          const hours = pick(block.data?.hours, lang);
          const distance = pick(block.data?.distance, lang);
          const price = pick(block.data?.price, lang);
          const pros = (block.data?.pros || []).filter(Boolean);
          const cons = (block.data?.cons || []).filter(Boolean);
          return (
            <div key={block.id} className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl overflow-hidden relative dark:bg-[#111827] dark:border-white/10">
              {block.data?.rank && (
                <div className="absolute top-6 end-6 z-10 bg-[#22C55E] text-[#0f172a] h-14 w-14 rounded-2xl flex flex-col items-center justify-center shadow-2xl rotate-3">
                  <span className="text-[10px] font-black uppercase">{lang === 'ar' ? 'المركز' : 'Rank'}</span>
                  <span className="text-2xl font-black">{block.data.rank}</span>
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-2/5 space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-inner group bg-[#111827]">
                      {block.data?.coverUrl ? (
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={block.data.coverUrl} alt="" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/70 text-xs">No image</div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(block.data?.galleryUrls || []).filter(Boolean).slice(0, 2).map((url: string, idx: number) => (
                        <img key={`${block.id}-gallery-${idx}`} className="aspect-square object-cover rounded-xl border border-gray-100" src={url} alt="" loading="lazy" />
                      ))}
                      <div className="aspect-square bg-[#111827] rounded-xl flex items-center justify-center text-white font-bold text-xs">
                        +{Math.max(0, (block.data?.galleryUrls || []).filter(Boolean).length - 2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black mb-1 text-[#111827] dark:text-white">
                        {title} {location && <span className="text-gray-400 text-lg font-medium">/ {location}</span>}
                      </h2>
                      <div className="flex items-center gap-3">
                        <div className="flex text-[#22C55E]">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={`${block.id}-star-${i}`} className="w-4 h-4" />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-gray-500">
                          {block.data?.rating ? `${block.data.rating}/5` : '—'} {block.data?.reviews ? `• ${block.data.reviews} ${lang === 'ar' ? 'تقييم' : 'reviews'}` : ''}
                        </span>
                      </div>
                    </div>
                    {description && (
                      <div className="bg-[#E8F5EC] border-s-4 border-[#22C55E] p-4 rounded-xl dark:bg-[#0f172a]">
                        <h4 className="font-bold text-[#22C55E] text-sm mb-1 italic">{lang === 'ar' ? 'لماذا اخترناه؟' : 'Why we picked it'}</h4>
                        <p className="text-sm text-[#0f172a]/80 dark:text-white/80">{description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400">{lang === 'ar' ? 'الإيجابيات' : 'Pros'}</h4>
                        <ul className="space-y-2">
                          {pros.map((item: any, idx: number) => (
                            <li key={`${block.id}-pro-${idx}`} className="flex items-start gap-2 text-xs font-medium">
                              <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5" />
                              {pick(item, lang)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400">{lang === 'ar' ? 'السلبيات' : 'Cons'}</h4>
                        <ul className="space-y-2">
                          {cons.map((item: any, idx: number) => (
                            <li key={`${block.id}-con-${idx}`} className="flex items-start gap-2 text-xs font-medium">
                              <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                              {pick(item, lang)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  {address && (
                    <div className="flex gap-3">
                      <MapPin className="w-4 h-4 text-[#22C55E]" />
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'ar' ? 'العنوان' : 'Address'}</div>
                        <div className="font-bold leading-tight">{address}</div>
                      </div>
                    </div>
                  )}
                  {hours && (
                    <div className="flex gap-3">
                      <Clock className="w-4 h-4 text-[#22C55E]" />
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'ar' ? 'ساعات العمل' : 'Hours'}</div>
                        <div className="font-bold leading-tight">{hours}</div>
                      </div>
                    </div>
                  )}
                  {distance && (
                    <div className="flex gap-3">
                      <Map className="w-4 h-4 text-[#22C55E]" />
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'ar' ? 'المسافة' : 'Distance'}</div>
                        <div className="font-bold leading-tight">{distance}</div>
                      </div>
                    </div>
                  )}
                  {price && (
                    <div className="flex gap-3">
                      <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'ar' ? 'متوسط التكلفة' : 'Avg. Cost'}</div>
                        <div className="font-bold leading-tight">{price}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {block.data?.mapUrl && (
                    <a className="flex-1 min-w-[180px] flex items-center justify-center gap-2 bg-[#22C55E] text-[#0f172a] py-3 rounded-xl font-black text-sm shadow-xl shadow-[#22C55E]/20" href={block.data.mapUrl} target="_blank" rel="noreferrer">
                      <MapPin className="w-4 h-4" />
                      {lang === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                    </a>
                  )}
                  {block.data?.phone && (
                    <a className="px-8 flex items-center justify-center gap-2 border-2 border-[#22C55E] text-[#22C55E] py-3 rounded-xl font-black text-sm hover:bg-[#22C55E]/10" href={`tel:${block.data.phone}`}>
                      <Phone className="w-4 h-4" />
                      {lang === 'ar' ? 'اتصل الآن' : 'Call now'}
                    </a>
                  )}
                </div>
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
