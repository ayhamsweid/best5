import React, { useEffect, useMemo, useRef, useState } from 'react';
import BlogBlocksRenderer from '../components/BlogBlocksRenderer';
import { fetchCategories, fetchUploads, uploadImage } from '../services/api';

type Lang = 'ar' | 'en';
type Localized = string | { ar?: string; en?: string };

interface PostEditorProps {
  values: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}

type Block =
  | { id: string; type: 'heading'; data: { text: Localized; level: number } }
  | { id: string; type: 'paragraph'; data: { text: Localized } }
  | { id: string; type: 'image'; data: { url: string; caption?: Localized } }
  | { id: string; type: 'gallery'; data: { urls: string[] } }
  | { id: string; type: 'map'; data: { embedUrl: string } }
  | { id: string; type: 'video'; data: { embedUrl: string } }
  | { id: string; type: 'cta'; data: { label: Localized; url: string } }
  | { id: string; type: 'summary'; data: { title: Localized; items: Localized[] } }
  | { id: string; type: 'comparison'; data: { headers: Localized[]; rows: Localized[][]; title?: Localized } }
  | { id: string; type: 'cards'; data: { title?: Localized; cards: Array<{ title: Localized; label?: Localized; note?: Localized; icon?: string }> } }
  | { id: string; type: 'guide'; data: { title: Localized; content: Localized } }
  | { id: string; type: 'faq'; data: { title?: Localized; items: Array<{ q: Localized; a: Localized }> } }
  | {
      id: string;
      type: 'restaurant';
      data: {
        rank?: number;
        name: Localized;
        location?: Localized;
        rating?: number;
        reviews?: number;
        description?: Localized;
        coverUrl?: string;
        galleryUrls?: string[];
        pros?: Localized[];
        cons?: Localized[];
        address?: Localized;
        hours?: Localized;
        distance?: Localized;
        price?: Localized;
        mapUrl?: string;
        phone?: string;
      };
    };

const makeId = () => Math.random().toString(36).slice(2);

const defaultBlocks = (): Block[] => [
  { id: makeId(), type: 'heading', data: { text: { ar: 'عنوان القسم', en: 'Section title' }, level: 2 } },
  { id: makeId(), type: 'paragraph', data: { text: { ar: 'اكتب النص هنا...', en: 'Write here...' } } }
];

const PostEditor: React.FC<PostEditorProps> = ({ values, onChange }) => {
  const update = (key: string, value: any) => onChange({ ...values, [key]: value });
  const [blocks, setBlocks] = useState<Block[]>(() => values.content_blocks_json || defaultBlocks());
  const [dragId, setDragId] = useState<string | null>(null);
  const [contentLang, setContentLang] = useState<Lang>('ar');
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const lastIdRef = useRef<string | null>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string }[]>([]);
  const [mediaTarget, setMediaTarget] = useState<{ type: 'cover' | 'image' | 'gallery'; blockId?: string } | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [builderMode, setBuilderMode] = useState(true);

  useEffect(() => {
    const key = values?.id || 'new';
    if (lastIdRef.current !== key) {
      setBlocks(values.content_blocks_json || defaultBlocks());
      lastIdRef.current = key;
    }
  }, [values?.id, values?.content_blocks_json]);

  useEffect(() => {
    update('content_blocks_json', blocks);
  }, [blocks]);

  useEffect(() => {
    if (!showMedia) return;
    fetchUploads().then(setMediaFiles).catch(() => setMediaFiles([]));
  }, [showMedia]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!selectedId && blocks.length) {
      setSelectedId(blocks[0].id);
    } else if (selectedId && !blocks.find((b) => b.id === selectedId) && blocks.length) {
      setSelectedId(blocks[0].id);
    }
  }, [blocks, selectedId]);

  const getLocalized = (value: Localized | undefined, fallback = '') => {
    if (typeof value === 'string') return value || fallback;
    return (value?.[contentLang] ?? value?.ar ?? value?.en ?? fallback) as string;
  };

  const setLocalized = (value: Localized | undefined, next: string): Localized => {
    if (typeof value === 'string') {
      return { ar: value, en: value, [contentLang]: next };
    }
    return { ...(value || {}), [contentLang]: next };
  };

  const widgets = useMemo(
    () => [
      { type: 'cards', label: 'Quick Picks' },
      { type: 'comparison', label: 'Comparison Table' },
      { type: 'restaurant', label: 'Restaurant Card / بطاقة مطعم' },
      { type: 'guide', label: 'Guide Section' },
      { type: 'faq', label: 'FAQ' },
      { type: 'paragraph', label: 'Paragraph' },
      { type: 'heading', label: 'Heading' },
      { type: 'image', label: 'Image' },
      { type: 'gallery', label: 'Gallery' },
      { type: 'map', label: 'Map' },
      { type: 'video', label: 'Video' },
      { type: 'cta', label: 'CTA Button' },
      { type: 'summary', label: 'Quick Summary' }
    ],
    []
  );

  const burgerGuideTemplate = (): Block[] => [
    {
      id: makeId(),
      type: 'cards',
      data: {
        title: { ar: 'ملخص سريع للأفضل', en: 'Quick Picks' },
        cards: [
          { title: { ar: 'الأفضل إجمالاً', en: 'Best Overall' }, label: { ar: 'زولا (Zula)', en: 'Zula' }, note: { ar: 'تجربة متكاملة وجودة ممتازة.', en: 'Complete experience and great quality.' }, icon: 'Star' },
          { title: { ar: 'أفضل قيمة', en: 'Best Value' }, label: { ar: 'بي بي برغر (B.B.)', en: 'B.B. Burger' }, note: { ar: 'أفضل سعر مقابل الجودة.', en: 'Great value for the price.' }, icon: 'TrendingUp' },
          { title: { ar: 'أفضل أجواء', en: 'Best Atmosphere' }, label: { ar: 'أكالي (Akali)', en: 'Akali' }, note: { ar: 'أجواء شبابية مميزة.', en: 'Vibrant, youthful vibe.' }, icon: 'Sparkles' }
        ]
      }
    },
    {
      id: makeId(),
      type: 'comparison',
      data: {
        title: { ar: 'جدول مقارنة سريع', en: 'Quick Comparison' },
        headers: [{ ar: 'الترتيب', en: 'Rank' }, { ar: 'المطعم', en: 'Restaurant' }, { ar: 'التقييم', en: 'Rating' }, { ar: 'السعر', en: 'Price' }, { ar: 'أفضل ميزة', en: 'Best For' }],
        rows: [
          [{ ar: '#1', en: '#1' }, { ar: 'زولا (Zula)', en: 'Zula' }, { ar: '4.9', en: '4.9' }, { ar: '₺₺₺', en: '₺₺₺' }, { ar: 'الصلصات السرية', en: 'Signature sauces' }],
          [{ ar: '#2', en: '#2' }, { ar: 'بي بي برغر (B.B.)', en: 'B.B. Burger' }, { ar: '4.7', en: '4.7' }, { ar: '₺₺', en: '₺₺' }, { ar: 'البطاطس المقرمشة', en: 'Crispy fries' }]
        ]
      }
    },
    {
      id: makeId(),
      type: 'restaurant',
      data: {
        rank: 1,
        name: { ar: 'زولا (Zula)', en: 'Zula' },
        location: { ar: 'بشكتاش', en: 'Beşiktaş' },
        rating: 4.9,
        reviews: 1240,
        description: {
          ar: 'يعتبر زولا علامة فارقة في عالم البرغر التركي، حيث يركز على بساطة المكونات وجودتها الفائقة.',
          en: 'Zula is a standout for premium burgers with excellent ingredient quality.'
        },
        coverUrl: '',
        galleryUrls: ['', '', ''],
        pros: [{ ar: 'أفضل خبز بريوش', en: 'Best brioche bun' }, { ar: 'خيارات نباتية ممتازة', en: 'Great veggie options' }],
        cons: [{ ar: 'ازدحام في نهاية الأسبوع', en: 'Crowded on weekends' }],
        address: { ar: 'شارع سنان باشا، زقاق الورد، بشكتاش', en: 'Sinan Pasa St, Beşiktaş' },
        hours: { ar: '12:00 م - 11:30 م', en: '12:00 PM - 11:30 PM' },
        distance: { ar: '350م من تمثال النسر', en: '350m from Eagle Statue' },
        price: { ar: '₺350 - ₺500 للشخص', en: '₺350 - ₺500 per person' }
      }
    },
    {
      id: makeId(),
      type: 'map',
      data: { embedUrl: '' }
    },
    {
      id: makeId(),
      type: 'guide',
      data: {
        title: { ar: 'دليل اختيار البرغر', en: 'Burger Buying Guide' },
        content: { ar: 'أضف نص الدليل هنا...', en: 'Add guide content here...' }
      }
    },
    {
      id: makeId(),
      type: 'faq',
      data: {
        title: { ar: 'الأسئلة الشائعة', en: 'FAQ' },
        items: [{ q: { ar: 'هل تتوفر خيارات نباتية؟', en: 'Are there veggie options?' }, a: { ar: 'نعم، بعض المطاعم تقدم خيارات ممتازة.', en: 'Yes, several places have great options.' } }]
      }
    }
  ];

  const addBlock = (type: Block['type']) => {
    const block: Block =
      type === 'heading'
        ? { id: makeId(), type, data: { text: { ar: '', en: '' }, level: 2 } }
        : type === 'paragraph'
        ? { id: makeId(), type, data: { text: { ar: '', en: '' } } }
        : type === 'image'
        ? { id: makeId(), type, data: { url: '', caption: { ar: '', en: '' } } }
        : type === 'gallery'
        ? { id: makeId(), type, data: { urls: [''] } }
        : type === 'map'
        ? { id: makeId(), type, data: { embedUrl: '' } }
        : type === 'video'
        ? { id: makeId(), type, data: { embedUrl: '' } }
        : type === 'cta'
        ? { id: makeId(), type, data: { label: { ar: '', en: '' }, url: '' } }
        : type === 'comparison'
        ? { id: makeId(), type, data: { title: { ar: 'جدول مقارنة سريع', en: 'Quick Comparison' }, headers: [{ ar: '#', en: '#' }, { ar: 'الاسم', en: 'Name' }, { ar: 'التقييم', en: 'Score' }], rows: [[{ ar: '1', en: '1' }, { ar: '', en: '' }, { ar: '', en: '' }]] } }
        : type === 'cards'
        ? { id: makeId(), type, data: { title: { ar: 'ملخص سريع للأفضل', en: 'Quick Picks' }, cards: [{ title: { ar: '', en: '' }, label: { ar: '', en: '' }, note: { ar: '', en: '' }, icon: 'Star' }] } }
        : type === 'guide'
        ? { id: makeId(), type, data: { title: { ar: 'نص الدليل', en: 'Guide Content' }, content: { ar: '', en: '' } } }
        : type === 'faq'
        ? { id: makeId(), type, data: { title: { ar: 'الأسئلة الشائعة', en: 'FAQ' }, items: [{ q: { ar: '', en: '' }, a: { ar: '', en: '' } }] } }
        : type === 'restaurant'
        ? {
            id: makeId(),
            type,
            data: {
              rank: 1,
              name: { ar: '', en: '' },
              location: { ar: '', en: '' },
              rating: 4.5,
              reviews: 120,
              description: { ar: '', en: '' },
              coverUrl: '',
              galleryUrls: [''],
              pros: [{ ar: '', en: '' }],
              cons: [{ ar: '', en: '' }],
              address: { ar: '', en: '' },
              hours: { ar: '', en: '' },
              distance: { ar: '', en: '' },
              price: { ar: '', en: '' },
              mapUrl: '',
              phone: ''
            }
          }
        : { id: makeId(), type: 'summary', data: { title: { ar: '', en: '' }, items: [{ ar: '', en: '' }] } };
    setBlocks((prev) => [...prev, block]);
  };

  const updateBlock = (id: string, data: any) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)));
  };

  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  const moveBlock = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setBlocks((prev) => {
      const fromIndex = prev.findIndex((b) => b.id === fromId);
      const toIndex = prev.findIndex((b) => b.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  };

  const handleUpload = async (blockId: string, onUrl: (url: string) => void, file?: File | null) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [blockId]: true }));
    try {
      const result = await uploadImage(file);
      onUrl(result.url);
    } finally {
      setUploading((prev) => ({ ...prev, [blockId]: false }));
    }
  };

  const openMedia = (target: { type: 'cover' | 'image' | 'gallery'; blockId?: string }) => {
    setMediaTarget(target);
    setShowMedia(true);
  };

  const pickMedia = (url: string) => {
    if (!mediaTarget) return;
    if (mediaTarget.type === 'cover') {
      update('cover_image_url', url);
    } else if (mediaTarget.type === 'image' && mediaTarget.blockId) {
      const block = blocks.find((b) => b.id === mediaTarget.blockId);
      if (block && block.type === 'image') {
        updateBlock(block.id, { ...block.data, url });
      }
    } else if (mediaTarget.type === 'gallery' && mediaTarget.blockId) {
      const block = blocks.find((b) => b.id === mediaTarget.blockId);
      if (block && block.type === 'gallery') {
        updateBlock(block.id, { ...block.data, urls: [...block.data.urls, url] });
      }
    }
    setShowMedia(false);
  };

  const EditableText: React.FC<{
    value: string;
    onChange: (next: string) => void;
    className?: string;
    tag?: keyof JSX.IntrinsicElements;
    placeholder?: string;
  }> = ({ value, onChange, className = '', tag = 'span', placeholder }) => {
    const Tag = tag as any;
    return (
      <Tag
        className={`outline-none ${className} ${!value ? 'text-gray-500' : ''}`}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onBlur={(e: React.FocusEvent<HTMLElement>) => onChange(e.currentTarget.innerText)}
      >
        {value || ''}
      </Tag>
    );
  };

  const renderInlineBlock = (block: Block) => {
    if (block.type === 'heading') {
      const Tag = (`h${block.data?.level || 2}` as keyof JSX.IntrinsicElements);
      return (
        <EditableText
          tag={Tag}
          value={getLocalized(block.data.text)}
          onChange={(next) => updateBlock(block.id, { ...block.data, text: setLocalized(block.data.text, next) })}
          className="font-black text-[#111827] dark:text-white"
          placeholder="Heading"
        />
      );
    }

    if (block.type === 'paragraph') {
      return (
        <EditableText
          tag="p"
          value={getLocalized(block.data.text)}
          onChange={(next) => updateBlock(block.id, { ...block.data, text: setLocalized(block.data.text, next) })}
          className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap"
          placeholder="Write paragraph..."
        />
      );
    }

    if (block.type === 'summary') {
      return (
        <div className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-5 dark:bg-[#111827] dark:border-white/10">
          <EditableText
            tag="div"
            value={getLocalized(block.data?.title)}
            onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, next) })}
            className="font-black text-[#111827] dark:text-white mb-3"
            placeholder="Summary title"
          />
          <ul className="list-disc ps-5 text-gray-600 dark:text-gray-300 space-y-1">
            {(block.data?.items || []).map((item: any, idx: number) => (
              <li key={`${block.id}-item-${idx}`}>
                <EditableText
                  tag="span"
                  value={getLocalized(item)}
                  onChange={(next) => {
                    const nextItems = [...block.data.items];
                    nextItems[idx] = setLocalized(item, next);
                    updateBlock(block.id, { ...block.data, items: nextItems });
                  }}
                  placeholder="Item"
                />
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (block.type === 'comparison') {
      return (
        <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white dark:bg-[#111827] dark:border-white/10">
          {block.data?.title && (
            <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-white/10 font-black text-[#111827] dark:text-white">
              <EditableText
                tag="div"
                value={getLocalized(block.data.title)}
                onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, next) })}
              />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9FAFB] text-gray-500 text-xs dark:bg-[#0f172a]">
                <tr>
                  {(block.data?.headers || []).map((h: any, idx: number) => (
                    <th key={`${block.id}-h-${idx}`} className="px-4 py-3 text-start">
                      <EditableText
                        tag="span"
                        value={getLocalized(h)}
                        onChange={(next) => {
                          const headers = [...block.data.headers];
                          headers[idx] = setLocalized(h, next);
                          updateBlock(block.id, { ...block.data, headers });
                        }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(block.data?.rows || []).map((row: any[], rowIdx: number) => (
                  <tr key={`${block.id}-r-${rowIdx}`} className="border-b last:border-none dark:border-white/10">
                    {(block.data?.headers || []).map((_h: any, colIdx: number) => (
                      <td key={`${block.id}-r-${rowIdx}-${colIdx}`} className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        <EditableText
                          tag="span"
                          value={getLocalized(row[colIdx] || '')}
                          onChange={(next) => {
                            const rows = block.data.rows.map((r: any[]) => [...r]);
                            rows[rowIdx][colIdx] = setLocalized(row[colIdx] || '', next);
                            updateBlock(block.id, { ...block.data, rows });
                          }}
                        />
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
        <div className="space-y-4">
          {block.data?.title && (
            <EditableText
              tag="div"
              value={getLocalized(block.data.title)}
              onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, next) })}
              className="text-2xl font-black text-[#111827] dark:text-white"
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(block.data?.cards || []).map((card: any, idx: number) => (
              <div key={`${block.id}-card-${idx}`} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm dark:bg-[#111827] dark:border-white/10">
                <div className="font-black text-lg text-[#111827] dark:text-white">
                  <EditableText
                    tag="span"
                    value={getLocalized(card.title)}
                    onChange={(next) => {
                      const cards = [...block.data.cards];
                      cards[idx] = { ...card, title: setLocalized(card.title, next) };
                      updateBlock(block.id, { ...block.data, cards });
                    }}
                    placeholder="Title"
                  />
                </div>
                <div className="text-[#22C55E] font-bold text-sm mt-1">
                  <EditableText
                    tag="span"
                    value={getLocalized(card.label || '')}
                    onChange={(next) => {
                      const cards = [...block.data.cards];
                      cards[idx] = { ...card, label: setLocalized(card.label || '', next) };
                      updateBlock(block.id, { ...block.data, cards });
                    }}
                    placeholder="Label"
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <EditableText
                    tag="span"
                    value={getLocalized(card.note || '')}
                    onChange={(next) => {
                      const cards = [...block.data.cards];
                      cards[idx] = { ...card, note: setLocalized(card.note || '', next) };
                      updateBlock(block.id, { ...block.data, cards });
                    }}
                    placeholder="Note"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === 'guide') {
      return (
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm dark:bg-[#111827] dark:border-white/10">
          <EditableText
            tag="h2"
            value={getLocalized(block.data?.title)}
            onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, next) })}
            className="text-xl font-black mb-4 text-[#111827] dark:text-white"
            placeholder="Guide title"
          />
          <EditableText
            tag="div"
            value={getLocalized(block.data?.content)}
            onChange={(next) => updateBlock(block.id, { ...block.data, content: setLocalized(block.data.content, next) })}
            className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap"
            placeholder="Guide content"
          />
        </div>
      );
    }

    if (block.type === 'faq') {
      return (
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm dark:bg-[#111827] dark:border-white/10">
          <EditableText
            tag="h3"
            value={getLocalized(block.data?.title || '')}
            onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title || '', next) })}
            className="text-xl font-black mb-4 text-[#111827] dark:text-white"
            placeholder="FAQ title"
          />
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {(block.data?.items || []).map((item: any, idx: number) => (
              <div key={`${block.id}-faq-${idx}`}>
                <div className="font-semibold text-[#111827] dark:text-white">
                  <EditableText
                    tag="span"
                    value={getLocalized(item.q)}
                    onChange={(next) => {
                      const items = [...block.data.items];
                      items[idx] = { ...item, q: setLocalized(item.q, next) };
                      updateBlock(block.id, { ...block.data, items });
                    }}
                    placeholder="Question"
                  />
                </div>
                <EditableText
                  tag="div"
                  value={getLocalized(item.a)}
                  onChange={(next) => {
                    const items = [...block.data.items];
                    items[idx] = { ...item, a: setLocalized(item.a, next) };
                    updateBlock(block.id, { ...block.data, items });
                  }}
                  placeholder="Answer"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === 'cta') {
      return (
        <div className="rounded-2xl bg-[#E8F5EC] border border-[#D1E7D8] p-5 flex items-center justify-between gap-4 dark:bg-[#0f172a] dark:border-white/10">
          <EditableText
            tag="div"
            value={getLocalized(block.data?.label)}
            onChange={(next) => updateBlock(block.id, { ...block.data, label: setLocalized(block.data.label, next) })}
            className="font-semibold text-[#0f172a] dark:text-white"
            placeholder="CTA label"
          />
        </div>
      );
    }

    if (block.type === 'restaurant') {
      return (
        <div className="pointer-events-none">
          <BlogBlocksRenderer blocks={[block]} lang={contentLang} />
        </div>
      );
    }

    if (block.type === 'image') {
      return block.data?.url ? (
        <img src={block.data.url} alt="" className="rounded-2xl w-full object-cover" />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-6 text-xs text-gray-400">Image block</div>
      );
    }

    if (block.type === 'gallery') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(block.data?.urls || []).filter(Boolean).map((url: string, idx: number) => (
            <img key={`${block.id}-${idx}`} src={url} alt="" className="rounded-xl object-cover h-40 w-full" />
          ))}
        </div>
      );
    }

    if (block.type === 'map') {
      return (
        <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-white/10 p-4 text-gray-500">
          Map block (edit URL in Inspector)
        </div>
      );
    }

    if (block.type === 'video') {
      return (
        <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-white/10 p-4 text-gray-500">
          Video block (edit URL in Inspector)
        </div>
      );
    }

    return null;
  };

  const renderBlockEditor = (block: Block) => {
    if (block.type === 'heading') {
      return (
        <div className="flex gap-3">
          <select
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs"
            value={block.data.level}
            onChange={(e) => updateBlock(block.id, { ...block.data, level: Number(e.target.value) })}
          >
            {[1, 2, 3, 4].map((l) => (
              <option key={l} value={l}>
                H{l}
              </option>
            ))}
          </select>
          <input
            className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Heading text"
            value={getLocalized(block.data.text)}
            onChange={(e) => updateBlock(block.id, { ...block.data, text: setLocalized(block.data.text, e.target.value) })}
          />
        </div>
      );
    }

    if (block.type === 'paragraph') {
      return (
        <textarea
          className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[120px]"
          placeholder="Write paragraph..."
          value={getLocalized(block.data.text)}
          onChange={(e) => updateBlock(block.id, { ...block.data, text: setLocalized(block.data.text, e.target.value) })}
        />
      );
    }

    if (block.type === 'image') {
      return (
        <div className="space-y-3">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Image URL"
            value={block.data.url}
            onChange={(e) => updateBlock(block.id, { ...block.data, url: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <button
              className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10"
              onClick={() => openMedia({ type: 'image', blockId: block.id })}
            >
              Choose from Media
            </button>
            <input
              type="file"
              accept="image/*"
              className="text-xs text-gray-300"
              onChange={(e) => handleUpload(block.id, (url) => updateBlock(block.id, { ...block.data, url }), e.target.files?.[0])}
            />
          </div>
          {uploading[block.id] && <div className="text-xs text-gray-400">Uploading...</div>}
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Caption"
            value={getLocalized(block.data.caption || '')}
            onChange={(e) => updateBlock(block.id, { ...block.data, caption: setLocalized(block.data.caption || '', e.target.value) })}
          />
        </div>
      );
    }

    if (block.type === 'gallery') {
      return (
        <div className="space-y-2">
          {block.data.urls.map((url: string, idx: number) => (
            <input
              key={`${block.id}-url-${idx}`}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder={`Image URL ${idx + 1}`}
              value={url}
              onChange={(e) => {
                const next = [...block.data.urls];
                next[idx] = e.target.value;
                updateBlock(block.id, { ...block.data, urls: next });
              }}
            />
          ))}
          <button className="text-xs text-[#22C55E]" onClick={() => updateBlock(block.id, { ...block.data, urls: [...block.data.urls, ''] })}>
            + Add image
          </button>
          <button
            className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10"
            onClick={() => openMedia({ type: 'gallery', blockId: block.id })}
          >
            Choose from Media
          </button>
          <input
            type="file"
            accept="image/*"
            className="w-full text-xs text-gray-300"
            onChange={(e) =>
              handleUpload(block.id, (url) => updateBlock(block.id, { ...block.data, urls: [...block.data.urls, url] }), e.target.files?.[0])
            }
          />
          {uploading[block.id] && <div className="text-xs text-gray-400">Uploading...</div>}
        </div>
      );
    }

    if (block.type === 'map') {
      return (
        <input
          className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
          placeholder="Google Maps embed URL"
          value={block.data.embedUrl}
          onChange={(e) => updateBlock(block.id, { ...block.data, embedUrl: e.target.value })}
        />
      );
    }

    if (block.type === 'video') {
      return (
        <input
          className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
          placeholder="Video embed URL (YouTube/Vimeo)"
          value={block.data.embedUrl}
          onChange={(e) => updateBlock(block.id, { ...block.data, embedUrl: e.target.value })}
        />
      );
    }

    if (block.type === 'cta') {
      return (
        <div className="space-y-2">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Button label"
            value={getLocalized(block.data.label)}
            onChange={(e) => updateBlock(block.id, { ...block.data, label: setLocalized(block.data.label, e.target.value) })}
          />
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Button URL"
            value={block.data.url}
            onChange={(e) => updateBlock(block.id, { ...block.data, url: e.target.value })}
          />
        </div>
      );
    }

    if (block.type === 'summary') {
      return (
        <div className="space-y-2">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Summary title"
            value={getLocalized(block.data.title)}
            onChange={(e) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, e.target.value) })}
          />
          {block.data.items.map((item: string, idx: number) => (
            <input
              key={`${block.id}-item-${idx}`}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder={`Item ${idx + 1}`}
              value={getLocalized(item)}
              onChange={(e) => {
                const next = [...block.data.items];
                next[idx] = setLocalized(item, e.target.value);
                updateBlock(block.id, { ...block.data, items: next });
              }}
            />
          ))}
          <button className="text-xs text-[#22C55E]" onClick={() => updateBlock(block.id, { ...block.data, items: [...block.data.items, ''] })}>
            + Add item
          </button>
        </div>
      );
    }

    if (block.type === 'comparison') {
      return (
        <div className="space-y-3">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Table title"
            value={getLocalized(block.data.title || '')}
            onChange={(e) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title || '', e.target.value) })}
          />
          <div className="text-xs text-gray-300">Headers</div>
          {block.data.headers.map((h: string, idx: number) => (
            <div key={`${block.id}-h-${idx}`} className="flex items-center gap-2">
              <input
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder={`Header ${idx + 1}`}
                value={getLocalized(h)}
                onChange={(e) => {
                  const next = [...block.data.headers];
                  next[idx] = setLocalized(h, e.target.value);
                  updateBlock(block.id, { ...block.data, headers: next });
                }}
              />
              <button
                className="text-xs px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200"
                onClick={() => {
                  const nextHeaders = block.data.headers.filter((_v: any, i: number) => i !== idx);
                  const nextRows = block.data.rows.map((row: any[]) => row.filter((_v, i) => i !== idx));
                  updateBlock(block.id, { ...block.data, headers: nextHeaders, rows: nextRows });
                }}
              >
                حذف عمود
              </button>
            </div>
          ))}
          <button className="text-xs text-[#22C55E]" onClick={() => updateBlock(block.id, { ...block.data, headers: [...block.data.headers, ''] })}>
            + Add header
          </button>
          <div className="text-xs text-gray-300 mt-3">Rows</div>
          {block.data.rows.map((row: string[], rowIdx: number) => (
            <div key={`${block.id}-r-${rowIdx}`} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400">Row {rowIdx + 1}</div>
                <button
                  className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200"
                  onClick={() => {
                    const rows = block.data.rows.filter((_r: any, i: number) => i !== rowIdx);
                    updateBlock(block.id, { ...block.data, rows });
                  }}
                >
                  حذف سطر
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {block.data.headers.map((_h: string, colIdx: number) => (
                  <input
                    key={`${block.id}-r-${rowIdx}-${colIdx}`}
                    className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder={`Row ${rowIdx + 1} Col ${colIdx + 1}`}
                    value={getLocalized(row[colIdx] || '')}
                    onChange={(e) => {
                      const rows = block.data.rows.map((r: string[]) => [...r]);
                      rows[rowIdx][colIdx] = setLocalized(row[colIdx] || '', e.target.value);
                      updateBlock(block.id, { ...block.data, rows });
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          <button
            className="text-xs text-[#22C55E]"
            onClick={() => updateBlock(block.id, { ...block.data, rows: [...block.data.rows, Array(block.data.headers.length).fill('')] })}
          >
            + Add row
          </button>
        </div>
      );
    }

    if (block.type === 'cards') {
      return (
        <div className="space-y-3">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Section title"
            value={getLocalized(block.data.title || '')}
            onChange={(e) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title || '', e.target.value) })}
          />
          {block.data.cards.map((card: any, idx: number) => (
            <div key={`${block.id}-card-${idx}`} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Card title"
                value={getLocalized(card.title)}
                onChange={(e) => {
                  const next = [...block.data.cards];
                  next[idx] = { ...card, title: setLocalized(card.title, e.target.value) };
                  updateBlock(block.id, { ...block.data, cards: next });
                }}
              />
              <select
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                value={card.icon || 'Star'}
                onChange={(e) => {
                  const next = [...block.data.cards];
                  next[idx] = { ...card, icon: e.target.value };
                  updateBlock(block.id, { ...block.data, cards: next });
                }}
              >
                {['Star', 'Sparkles', 'Crown', 'TrendingUp', 'BadgeCheck', 'Leaf', 'MapPin', 'Zap'].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Badge label"
                value={getLocalized(card.label || '')}
                onChange={(e) => {
                  const next = [...block.data.cards];
                  next[idx] = { ...card, label: setLocalized(card.label || '', e.target.value) };
                  updateBlock(block.id, { ...block.data, cards: next });
                }}
              />
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Note"
                value={getLocalized(card.note || '')}
                onChange={(e) => {
                  const next = [...block.data.cards];
                  next[idx] = { ...card, note: setLocalized(card.note || '', e.target.value) };
                  updateBlock(block.id, { ...block.data, cards: next });
                }}
              />
            </div>
          ))}
          <button
            className="text-xs text-[#22C55E]"
            onClick={() =>
              updateBlock(block.id, { ...block.data, cards: [...block.data.cards, { title: { ar: '', en: '' }, label: { ar: '', en: '' }, note: { ar: '', en: '' }, icon: 'Star' }] })
            }
          >
            + Add card
          </button>
        </div>
      );
    }

    if (block.type === 'guide') {
      return (
        <div className="space-y-2">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Section title"
            value={getLocalized(block.data.title)}
            onChange={(e) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, e.target.value) })}
          />
          <textarea
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[140px]"
            placeholder="Write guide content..."
            value={getLocalized(block.data.content)}
            onChange={(e) => updateBlock(block.id, { ...block.data, content: setLocalized(block.data.content, e.target.value) })}
          />
        </div>
      );
    }

    if (block.type === 'faq') {
      return (
        <div className="space-y-2">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Section title"
            value={getLocalized(block.data.title || '')}
            onChange={(e) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title || '', e.target.value) })}
          />
          {block.data.items.map((item: any, idx: number) => (
            <div key={`${block.id}-faq-${idx}`} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Question"
                value={getLocalized(item.q)}
                onChange={(e) => {
                  const next = [...block.data.items];
                  next[idx] = { ...item, q: setLocalized(item.q, e.target.value) };
                  updateBlock(block.id, { ...block.data, items: next });
                }}
              />
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Answer"
                value={getLocalized(item.a)}
                onChange={(e) => {
                  const next = [...block.data.items];
                  next[idx] = { ...item, a: setLocalized(item.a, e.target.value) };
                  updateBlock(block.id, { ...block.data, items: next });
                }}
              />
            </div>
          ))}
          <button
            className="text-xs text-[#22C55E]"
            onClick={() => updateBlock(block.id, { ...block.data, items: [...block.data.items, { q: '', a: '' }] })}
          >
            + Add QA
          </button>
        </div>
      );
    }

    if (block.type === 'restaurant') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Rank"
              value={block.data.rank ?? ''}
              onChange={(e) => updateBlock(block.id, { ...block.data, rank: Number(e.target.value || 0) })}
            />
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Rating (e.g. 4.9)"
              value={block.data.rating ?? ''}
              onChange={(e) => updateBlock(block.id, { ...block.data, rating: Number(e.target.value || 0) })}
            />
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Reviews count"
              value={block.data.reviews ?? ''}
              onChange={(e) => updateBlock(block.id, { ...block.data, reviews: Number(e.target.value || 0) })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Restaurant name"
              value={getLocalized(block.data.name)}
              onChange={(e) => updateBlock(block.id, { ...block.data, name: setLocalized(block.data.name, e.target.value) })}
            />
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Location label"
              value={getLocalized(block.data.location || '')}
              onChange={(e) => updateBlock(block.id, { ...block.data, location: setLocalized(block.data.location || '', e.target.value) })}
            />
          </div>
          <textarea
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[110px]"
            placeholder="Short description"
            value={getLocalized(block.data.description || '')}
            onChange={(e) => updateBlock(block.id, { ...block.data, description: setLocalized(block.data.description || '', e.target.value) })}
          />
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Cover image URL"
            value={block.data.coverUrl || ''}
            onChange={(e) => updateBlock(block.id, { ...block.data, coverUrl: e.target.value })}
          />
          <div className="space-y-2">
            {(block.data.galleryUrls || []).map((url: string, idx: number) => (
              <input
                key={`${block.id}-gallery-${idx}`}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder={`Gallery URL ${idx + 1}`}
                value={url}
                onChange={(e) => {
                  const next = [...(block.data.galleryUrls || [])];
                  next[idx] = e.target.value;
                  updateBlock(block.id, { ...block.data, galleryUrls: next });
                }}
              />
            ))}
            <button
              className="text-xs text-[#22C55E]"
              onClick={() => updateBlock(block.id, { ...block.data, galleryUrls: [...(block.data.galleryUrls || []), ''] })}
            >
              + Add gallery image
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Address"
              value={getLocalized(block.data.address || '')}
              onChange={(e) => updateBlock(block.id, { ...block.data, address: setLocalized(block.data.address || '', e.target.value) })}
            />
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Hours"
              value={getLocalized(block.data.hours || '')}
              onChange={(e) => updateBlock(block.id, { ...block.data, hours: setLocalized(block.data.hours || '', e.target.value) })}
            />
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Distance"
              value={getLocalized(block.data.distance || '')}
              onChange={(e) => updateBlock(block.id, { ...block.data, distance: setLocalized(block.data.distance || '', e.target.value) })}
            />
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Price range"
              value={getLocalized(block.data.price || '')}
              onChange={(e) => updateBlock(block.id, { ...block.data, price: setLocalized(block.data.price || '', e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Map URL"
              value={block.data.mapUrl || ''}
              onChange={(e) => updateBlock(block.id, { ...block.data, mapUrl: e.target.value })}
            />
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Phone"
              value={block.data.phone || ''}
              onChange={(e) => updateBlock(block.id, { ...block.data, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-300">Pros</div>
            {(block.data.pros || []).map((item: any, idx: number) => (
              <input
                key={`${block.id}-pro-${idx}`}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder={`Pro ${idx + 1}`}
                value={getLocalized(item)}
                onChange={(e) => {
                  const next = [...(block.data.pros || [])];
                  next[idx] = setLocalized(item, e.target.value);
                  updateBlock(block.id, { ...block.data, pros: next });
                }}
              />
            ))}
            <button
              className="text-xs text-[#22C55E]"
              onClick={() => updateBlock(block.id, { ...block.data, pros: [...(block.data.pros || []), { ar: '', en: '' }] })}
            >
              + Add pro
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-300">Cons</div>
            {(block.data.cons || []).map((item: any, idx: number) => (
              <input
                key={`${block.id}-con-${idx}`}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder={`Con ${idx + 1}`}
                value={getLocalized(item)}
                onChange={(e) => {
                  const next = [...(block.data.cons || [])];
                  next[idx] = setLocalized(item, e.target.value);
                  updateBlock(block.id, { ...block.data, cons: next });
                }}
              />
            ))}
            <button
              className="text-xs text-[#22C55E]"
              onClick={() => updateBlock(block.id, { ...block.data, cons: [...(block.data.cons || []), { ar: '', en: '' }] })}
            >
              + Add con
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
          value={values.status || 'DRAFT'}
          onChange={(e) => update('status', e.target.value)}
        >
          <option value="DRAFT">Draft</option>
          <option value="REVIEW">Review</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <input
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
          placeholder="Published At (ISO)"
          value={values.published_at || ''}
          onChange={(e) => update('published_at', e.target.value)}
        />
        <input
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
          placeholder="Scheduled At (ISO)"
          value={values.scheduled_at || ''}
          onChange={(e) => update('scheduled_at', e.target.value)}
        />
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="text-xs text-gray-300 mb-3">SEO (optional)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="SEO Title (AR)"
            value={values.seo_title_ar || ''}
            onChange={(e) => update('seo_title_ar', e.target.value)}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="SEO Title (EN)"
            value={values.seo_title_en || ''}
            onChange={(e) => update('seo_title_en', e.target.value)}
          />
          <textarea
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[90px]"
            placeholder="SEO Description (AR)"
            value={values.seo_desc_ar || ''}
            onChange={(e) => update('seo_desc_ar', e.target.value)}
          />
          <textarea
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[90px]"
            placeholder="SEO Description (EN)"
            value={values.seo_desc_en || ''}
            onChange={(e) => update('seo_desc_en', e.target.value)}
          />
          <input
            className="md:col-span-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="OG Image URL (optional)"
            value={values.og_image_url || ''}
            onChange={(e) => update('og_image_url', e.target.value)}
          />
          <input
            className="md:col-span-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Canonical URL (optional)"
            value={values.canonical_url || ''}
            onChange={(e) => update('canonical_url', e.target.value)}
          />
        </div>
      </div>
      <div>
        <select
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm w-full"
          value={values.category_id || ''}
          onChange={(e) => update('category_id', e.target.value || null)}
        >
          <option value="">No Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {(cat.name_en || cat.name_ar) ?? 'Untitled'}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setContentLang('ar')}
          className={`px-3 py-1 rounded-full text-xs ${contentLang === 'ar' ? 'bg-primary text-[#0f172a]' : 'bg-white/10 text-white'}`}
        >
          AR
        </button>
        <button
          onClick={() => setContentLang('en')}
          className={`px-3 py-1 rounded-full text-xs ${contentLang === 'en' ? 'bg-primary text-[#0f172a]' : 'bg-white/10 text-white'}`}
        >
          EN
        </button>
        <button
          onClick={() => setBuilderMode((v) => !v)}
          className="px-3 py-1 rounded-full text-xs bg-white/10 text-white"
        >
          {builderMode ? 'Builder Mode' : 'Form Mode'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Title (AR)" value={values.title_ar || ''} onChange={(e) => update('title_ar', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Title (EN)" value={values.title_en || ''} onChange={(e) => update('title_en', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Excerpt (AR)" value={values.excerpt_ar || ''} onChange={(e) => update('excerpt_ar', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Excerpt (EN)" value={values.excerpt_en || ''} onChange={(e) => update('excerpt_en', e.target.value)} />
        <div className="md:col-span-2 flex items-center gap-3">
          <input className="flex-1 bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Cover Image URL" value={values.cover_image_url || ''} onChange={(e) => update('cover_image_url', e.target.value)} />
          <button
            onClick={() => openMedia({ type: 'cover' })}
            className="px-3 py-2 rounded-lg text-xs bg-white/10 border border-white/10 hover:bg-white/20"
          >
            Choose from Media
          </button>
          <input
            type="file"
            accept="image/*"
            className="text-xs text-gray-300"
            onChange={(e) =>
              handleUpload('cover', (url) => update('cover_image_url', url), e.target.files?.[0])
            }
          />
        </div>
      </div>

      {builderMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_260px] gap-6">
          <div className="space-y-4">
            <div className="text-xs text-gray-300">Canvas</div>
            <div dir={contentLang === 'ar' ? 'rtl' : 'ltr'} className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-[#111827] text-white mb-2">
                {values.cover_image_url && (
                  <img src={values.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
                <div className="relative z-10 px-4 py-6">
                  <div className="text-xs text-white/70 mb-2">{contentLang.toUpperCase()}</div>
                  <div className="text-xl font-black">
                    <EditableText
                      tag="span"
                      value={contentLang === 'ar' ? values.title_ar || '' : values.title_en || ''}
                      onChange={(next) => update(contentLang === 'ar' ? 'title_ar' : 'title_en', next)}
                      placeholder="Title"
                      className="text-white"
                    />
                  </div>
                  <div className="text-xs text-white/80 mt-2">
                    <EditableText
                      tag="span"
                      value={contentLang === 'ar' ? values.excerpt_ar || '' : values.excerpt_en || ''}
                      onChange={(next) => update(contentLang === 'ar' ? 'excerpt_ar' : 'excerpt_en', next)}
                      placeholder="Excerpt"
                      className="text-white/80"
                    />
                  </div>
                </div>
              </div>
              {blocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => setDragId(block.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dragId && moveBlock(dragId, block.id)}
                  onClick={() => setSelectedId(block.id)}
                  className={[
                    'bg-white/5 border rounded-2xl p-3 cursor-pointer transition',
                    selectedId === block.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-white/10 hover:border-white/30'
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] text-gray-400 uppercase">{block.type}</div>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-[10px] px-2 py-1 rounded-full bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          const idx = blocks.findIndex((b) => b.id === block.id);
                          if (idx > 0) moveBlock(block.id, blocks[idx - 1].id);
                        }}
                      >
                        Up
                      </button>
                      <button
                        className="text-[10px] px-2 py-1 rounded-full bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          const idx = blocks.findIndex((b) => b.id === block.id);
                          if (idx < blocks.length - 1) moveBlock(block.id, blocks[idx + 1].id);
                        }}
                      >
                        Down
                      </button>
                      <button
                        className="text-[10px] text-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBlock(block.id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {renderInlineBlock(block)}
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="text-xs text-gray-300">Inspector</div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              {!selectedId ? (
                <div className="text-xs text-gray-400">Select a block to edit.</div>
              ) : (
                <>
                  <div className="text-xs text-gray-400 mb-3">
                    Editing: {blocks.find((b) => b.id === selectedId)?.type}
                  </div>
                  {blocks
                    .filter((b) => b.id === selectedId)
                    .map((block) => (
                      <div key={block.id} className="space-y-3">
                        {renderBlockEditor(block)}
                      </div>
                    ))}
                </>
              )}
            </div>
          </aside>

          <aside className="space-y-3">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-gray-300 mb-3">Widgets</div>
              <div className="space-y-2">
                <button
                  onClick={() => setBlocks(burgerGuideTemplate())}
                  className="w-full text-start px-3 py-2 rounded-lg bg-primary/20 text-xs text-primary border border-primary/30 hover:bg-primary/30 transition"
                >
                  Apply Burger Guide Template
                </button>
                {widgets.map((w) => (
                  <button
                    key={w.type}
                    onClick={() => addBlock(w.type as Block['type'])}
                    className="w-full text-start px-3 py-2 rounded-lg bg-white/10 text-xs hover:bg-white/20 transition"
                  >
                    + {w.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-xs text-gray-300 mb-3">Widgets</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBlocks(burgerGuideTemplate())}
                className="px-3 py-2 rounded-lg bg-primary/20 text-xs text-primary border border-primary/30 hover:bg-primary/30 transition"
              >
                Apply Burger Guide Template
              </button>
              {widgets.map((w) => (
                <button
                  key={w.type}
                  onClick={() => addBlock(w.type as Block['type'])}
                  className="px-3 py-2 rounded-lg bg-white/10 text-xs hover:bg-white/20 transition"
                >
                  + {w.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {blocks.map((block) => (
              <div key={block.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-300 uppercase">⠿ {block.type}</div>
                  <button className="text-xs text-red-300" onClick={() => removeBlock(block.id)}>
                    Remove
                  </button>
                </div>
                {renderBlockEditor(block)}
              </div>
            ))}
          </div>
        </div>
      )}

      {showMedia && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 max-w-4xl w-[90%]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Media Library</div>
              <button onClick={() => setShowMedia(false)} className="text-xs text-gray-300">Close</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="file"
                accept="image/*"
                className="text-xs text-gray-300"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const result = await uploadImage(file);
                  setMediaFiles((prev) => [{ name: result.url.split('/').pop() || result.url, url: result.url }, ...prev]);
                }}
              />
            </div>
            {mediaFiles.length === 0 ? (
              <div className="text-xs text-gray-400">No images uploaded yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto">
                {mediaFiles.map((file) => (
                  <button
                    key={file.url}
                    onClick={() => pickMedia(file.url)}
                    className="bg-white/5 border border-white/10 rounded-xl p-2 hover:border-primary"
                  >
                    <img src={file.url} alt={file.name} className="w-full h-24 object-cover rounded-lg" />
                    <div className="text-[10px] text-gray-300 mt-2 truncate">{file.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditor;
