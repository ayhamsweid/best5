import React, { useEffect, useMemo, useRef, useState } from 'react';
import BlogBlocksRenderer from '../components/BlogBlocksRenderer';
import { fetchUploads, uploadImage } from '../services/api';

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
  | { id: string; type: 'faq'; data: { title?: Localized; items: Array<{ q: Localized; a: Localized }> } };

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
  const [showPreview, setShowPreview] = useState(true);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const lastIdRef = useRef<string | null>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string }[]>([]);
  const [mediaTarget, setMediaTarget] = useState<{ type: 'cover' | 'image' | 'gallery'; blockId?: string } | null>(null);

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
          onClick={() => setShowPreview((v) => !v)}
          className="px-3 py-1 rounded-full text-xs bg-white/10 text-white"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
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

      <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-[1fr_1fr_260px]' : 'lg:grid-cols-[1fr_260px]'} gap-6`}>
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={() => setDragId(block.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && moveBlock(dragId, block.id)}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-300 uppercase">⠿ {block.type}</div>
                <button className="text-xs text-red-300" onClick={() => removeBlock(block.id)}>Remove</button>
              </div>

              {block.type === 'heading' && (
                <div className="flex gap-3">
                  <select
                    className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs"
                    value={block.data.level}
                    onChange={(e) => updateBlock(block.id, { ...block.data, level: Number(e.target.value) })}
                  >
                    {[1,2,3,4].map((l) => <option key={l} value={l}>H{l}</option>)}
                  </select>
                  <input
                    className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Heading text"
                    value={getLocalized(block.data.text)}
                    onChange={(e) => updateBlock(block.id, { ...block.data, text: setLocalized(block.data.text, e.target.value) })}
                  />
                </div>
              )}

              {block.type === 'paragraph' && (
                <textarea
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[120px]"
                  placeholder="Write paragraph..."
                  value={getLocalized(block.data.text)}
                  onChange={(e) => updateBlock(block.id, { ...block.data, text: setLocalized(block.data.text, e.target.value) })}
                />
              )}

              {block.type === 'image' && (
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
                      onChange={(e) =>
                        handleUpload(block.id, (url) => updateBlock(block.id, { ...block.data, url }), e.target.files?.[0])
                      }
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-gray-300"
                    onChange={(e) =>
                      handleUpload(block.id, (url) => updateBlock(block.id, { ...block.data, url }), e.target.files?.[0])
                    }
                  />
                  {uploading[block.id] && <div className="text-xs text-gray-400">Uploading...</div>}
                  <input
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Caption"
                    value={getLocalized(block.data.caption || '')}
                    onChange={(e) => updateBlock(block.id, { ...block.data, caption: setLocalized(block.data.caption || '', e.target.value) })}
                  />
                </div>
              )}

              {block.type === 'gallery' && (
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
                  <button
                    className="text-xs text-[#22C55E]"
                    onClick={() => updateBlock(block.id, { ...block.data, urls: [...block.data.urls, ''] })}
                  >
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
                      handleUpload(
                        block.id,
                        (url) => updateBlock(block.id, { ...block.data, urls: [...block.data.urls, url] }),
                        e.target.files?.[0]
                      )
                    }
                  />
                  {uploading[block.id] && <div className="text-xs text-gray-400">Uploading...</div>}
                </div>
              )}

              {block.type === 'map' && (
                <input
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Google Maps embed URL"
                  value={block.data.embedUrl}
                  onChange={(e) => updateBlock(block.id, { ...block.data, embedUrl: e.target.value })}
                />
              )}

              {block.type === 'video' && (
                <input
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Video embed URL (YouTube/Vimeo)"
                  value={block.data.embedUrl}
                  onChange={(e) => updateBlock(block.id, { ...block.data, embedUrl: e.target.value })}
                />
              )}

              {block.type === 'cta' && (
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
              )}

              {block.type === 'summary' && (
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
                  <button
                    className="text-xs text-[#22C55E]"
                    onClick={() => updateBlock(block.id, { ...block.data, items: [...block.data.items, ''] })}
                  >
                    + Add item
                  </button>
                </div>
              )}

              {block.type === 'comparison' && (
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
                  <button
                    className="text-xs text-[#22C55E]"
                    onClick={() => updateBlock(block.id, { ...block.data, headers: [...block.data.headers, ''] })}
                  >
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
              )}

              {block.type === 'cards' && (
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
                          <option key={name} value={name}>{name}</option>
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
              )}

              {block.type === 'guide' && (
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
              )}

              {block.type === 'faq' && (
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
              )}
            </div>
          ))}
        </div>

        {showPreview && (
          <aside className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-xs text-gray-300 mb-3">Live Preview</div>
            <div dir={contentLang === 'ar' ? 'rtl' : 'ltr'} className="bg-[#F9FAFB] text-[#111827] rounded-2xl p-4">
              <div className="relative overflow-hidden rounded-2xl bg-[#111827] text-white mb-4">
                {values.cover_image_url && (
                  <img
                    src={values.cover_image_url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
                <div className="relative z-10 px-4 py-6">
                  <div className="text-xs text-white/70 mb-2">{contentLang.toUpperCase()}</div>
                  <div className="text-xl font-black">{contentLang === 'ar' ? values.title_ar : values.title_en}</div>
                  <div className="text-xs text-white/80 mt-2">{contentLang === 'ar' ? values.excerpt_ar : values.excerpt_en}</div>
                </div>
              </div>
              <BlogBlocksRenderer blocks={blocks} lang={contentLang} fallbackHtml="" />
            </div>
          </aside>
        )}

        <aside className="space-y-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-xs text-gray-300 mb-3">Widgets</div>
            <div className="space-y-2">
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
