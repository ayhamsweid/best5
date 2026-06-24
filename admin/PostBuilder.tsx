import React, { useEffect, useMemo, useRef, useState } from 'react';
import { uploadImage, fetchUploads, fetchCategories, fetchTags, createCategory, createTag } from '../services/api';
import { parseImportedPostJson } from '../utils/postJsonImport';

type Lang = 'ar' | 'en';
type Localized = string | { ar?: string; en?: string };

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

interface PostBuilderProps {
  values: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
  onPreview: (payload: { values: Record<string, any>; lang: Lang; blocks: Block[] }) => void;
  onPreviewPublic?: (payload: { values: Record<string, any>; lang: Lang; blocks: Block[] }) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const makeId = () => Math.random().toString(36).slice(2);

const defaultBlocks = (): Block[] => [
  { id: makeId(), type: 'heading', data: { text: { ar: 'عنوان القسم', en: 'Section title' }, level: 2 } },
  { id: makeId(), type: 'paragraph', data: { text: { ar: 'اكتب النص هنا...', en: 'Write here...' } } }
];

const PostBuilder: React.FC<PostBuilderProps> = ({ values, onChange, onPreview, onPreviewPublic, onSaveDraft, onPublish }) => {
  const historyRef = useRef<{ values: Record<string, any>; blocks: Block[] }[]>([]);
  const historyIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);
  const latestValuesRef = useRef(values);
  const latestBlocksRef = useRef<Block[]>(values.content_blocks_json || defaultBlocks());

  const update = (key: string, value: any) => {
    recordHistory();
    onChange({ ...latestValuesRef.current, [key]: value });
  };

  const updateSilent = (key: string, value: any) => {
    onChange({ ...latestValuesRef.current, [key]: value });
  };
  const [blocks, setBlocks] = useState<Block[]>(() => values.content_blocks_json || defaultBlocks());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [contentLang, setContentLang] = useState<Lang>('ar');
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [showMedia, setShowMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string }[]>([]);
  const [mediaTarget, setMediaTarget] = useState<{ type: 'cover' | 'image' | 'gallery'; blockId?: string } | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [newCategoryAr, setNewCategoryAr] = useState('');
  const [newCategoryEn, setNewCategoryEn] = useState('');
  const [newTagAr, setNewTagAr] = useState('');
  const [newTagEn, setNewTagEn] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const key = values?.id || 'new';
    if (lastIdRef.current !== key) {
      setBlocks(values.content_blocks_json || defaultBlocks());
      lastIdRef.current = key;
      resetHistory(values, values.content_blocks_json || defaultBlocks());
    }
  }, [values?.id, values?.content_blocks_json]);

  useEffect(() => {
    updateSilent('content_blocks_json', blocks);
  }, [blocks]);

  useEffect(() => {
    latestValuesRef.current = values;
  }, [values]);

  useEffect(() => {
    latestBlocksRef.current = blocks;
  }, [blocks]);

  useEffect(() => {
    if (!selectedId && blocks.length) {
      setSelectedId(blocks[0].id);
    } else if (selectedId && !blocks.find((b) => b.id === selectedId) && blocks.length) {
      setSelectedId(blocks[0].id);
    }
  }, [blocks, selectedId]);

  useEffect(() => {
    if (!showMedia) return;
    fetchUploads().then(setMediaFiles).catch(() => setMediaFiles([]));
  }, [showMedia]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchTags().then(setTags).catch(() => setTags([]));
  }, []);

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

  const updateBlock = (id: string, data: any) => {
    recordHistory();
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)));
  };

  const removeBlock = (id: string) => {
    recordHistory();
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (fromId: string, toId: string) => {
    if (!toId || fromId === toId) return;
    recordHistory();
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

  const resetHistory = (nextValues: Record<string, any>, nextBlocks: Block[]) => {
    historyRef.current = [
      {
        values: JSON.parse(JSON.stringify(nextValues || {})),
        blocks: JSON.parse(JSON.stringify(nextBlocks || []))
      }
    ];
    historyIndexRef.current = 0;
    setUndoVersion((v) => v + 1);
  };

  const recordHistory = () => {
    if (isRestoringRef.current) return;
    const snapshot = {
      values: JSON.parse(JSON.stringify(latestValuesRef.current || {})),
      blocks: JSON.parse(JSON.stringify(latestBlocksRef.current || []))
    };
    const history = historyRef.current;
    const idx = historyIndexRef.current;
    if (idx >= 0 && JSON.stringify(history[idx]) === JSON.stringify(snapshot)) {
      return;
    }
    const nextHistory = history.slice(0, idx + 1);
    nextHistory.push(snapshot);
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    setUndoVersion((v) => v + 1);
  };

  const [undoVersion, setUndoVersion] = useState(0);
  const canUndo = historyIndexRef.current > 0;
  const selectedTagIds = useMemo(() => {
    if (Array.isArray(values.tag_ids)) return values.tag_ids;
    if (Array.isArray(values.tags)) {
      return values.tags
        .map((postTag: any) => postTag?.tag?.id || postTag?.tag_id)
        .filter(Boolean);
    }
    return [];
  }, [values.tag_ids, values.tags]);

  const undo = () => {
    if (!canUndo) return;
    isRestoringRef.current = true;
    historyIndexRef.current -= 1;
    const snapshot = historyRef.current[historyIndexRef.current];
    setBlocks(snapshot.blocks);
    onChange(snapshot.values);
    isRestoringRef.current = false;
    setUndoVersion((v) => v + 1);
  };

  const toggleTag = (tagId: string) => {
    const current = new Set(selectedTagIds);
    if (current.has(tagId)) {
      current.delete(tagId);
    } else {
      current.add(tagId);
    }
    update('tag_ids', Array.from(current));
  };

  const handleCreateCategory = async () => {
    const nameAr = newCategoryAr.trim();
    const nameEn = newCategoryEn.trim();
    if (!nameAr || !nameEn) return;
    setCreatingCategory(true);
    try {
      const created = await createCategory({ name_ar: nameAr, name_en: nameEn });
      setCategories((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
      update('category_id', created.id);
      setNewCategoryAr('');
      setNewCategoryEn('');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreateTag = async () => {
    const nameAr = newTagAr.trim();
    const nameEn = newTagEn.trim();
    if (!nameAr || !nameEn) return;
    setCreatingTag(true);
    try {
      const created = await createTag({ name_ar: nameAr, name_en: nameEn });
      setTags((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
      update('tag_ids', Array.from(new Set([...selectedTagIds, created.id])));
      setNewTagAr('');
      setNewTagEn('');
    } finally {
      setCreatingTag(false);
    }
  };

  const importFromJsonFile = async (file?: File | null) => {
    if (!file) return;
    try {
      const raw = await file.text();
      const imported = parseImportedPostJson(raw);
      const importedBlocks = (imported.blocks || []).map((block) => ({ ...block, id: block?.id || makeId() })) as Block[];
      recordHistory();
      setBlocks(importedBlocks);
      onChange({
        ...latestValuesRef.current,
        ...imported.values,
        content_blocks_json: importedBlocks
      });
      setSelectedId(importedBlocks[0]?.id || null);
      alert(`Imported JSON successfully (${importedBlocks.length} blocks).`);
    } catch (error: any) {
      alert(error?.message || 'Invalid JSON file');
    }
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

  const widgets = useMemo(
    () => [
      { type: 'cards', label: 'Quick Picks' },
      { type: 'comparison', label: 'Comparison Table' },
      { type: 'restaurant', label: 'Restaurant Card' },
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
    recordHistory();
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

  const renderInlineBlock = (block: Block) => {
    if (block.type === 'heading') {
      const Tag = (`h${block.data?.level || 2}` as keyof JSX.IntrinsicElements);
      return (
        <EditableText
          tag={Tag}
          value={getLocalized(block.data.text)}
          onChange={(next) => updateBlock(block.id, { ...block.data, text: setLocalized(block.data.text, next) })}
          className="font-black text-[#111827]"
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
          className="text-gray-600 whitespace-pre-wrap"
          placeholder="Write paragraph..."
        />
      );
    }

    if (block.type === 'summary') {
      return (
        <div className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-5">
          <EditableText
            tag="div"
            value={getLocalized(block.data?.title)}
            onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, next) })}
            className="font-black text-[#111827] mb-3"
            placeholder="Summary title"
          />
          <ul className="list-disc ps-5 text-gray-600 space-y-1">
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
      const headers = block.data?.headers || [];
      const rows = block.data?.rows || [];
      return (
        <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white">
          {block.data?.title && (
            <div className="px-6 py-4 border-b border-[#E5E7EB] font-black text-[#111827]">
              <EditableText
                tag="div"
                value={getLocalized(block.data.title)}
                onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, next) })}
              />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9FAFB] text-gray-500 text-xs">
                <tr>
                  {headers.map((h: any, idx: number) => (
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
                {rows.map((row: any[], rowIdx: number) => (
                  <tr key={`${block.id}-r-${rowIdx}`} className="border-b last:border-none">
                    {headers.map((_h: any, colIdx: number) => (
                      <td key={`${block.id}-r-${rowIdx}-${colIdx}`} className="px-4 py-3 text-gray-600">
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
          <div className="px-4 py-3 border-t border-[#E5E7EB] flex flex-wrap gap-2 text-xs">
            <button
              className="px-3 py-1 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#14532d]"
              onClick={() => updateBlock(block.id, { ...block.data, rows: [...rows, Array(headers.length).fill('')] })}
            >
              + Row
            </button>
            <button
              className="px-3 py-1 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#14532d]"
              onClick={() => {
                const nextHeaders = [...headers, ''];
                const nextRows = rows.map((row: any[]) => [...row, '']);
                updateBlock(block.id, { ...block.data, headers: nextHeaders, rows: nextRows });
              }}
            >
              + Column
            </button>
            <button
              className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200"
              onClick={() => {
                if (!rows.length) return;
                updateBlock(block.id, { ...block.data, rows: rows.slice(0, -1) });
              }}
            >
              - Last Row
            </button>
            <button
              className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200"
              onClick={() => {
                if (!headers.length) return;
                const nextHeaders = headers.slice(0, -1);
                const nextRows = rows.map((row: any[]) => row.slice(0, -1));
                updateBlock(block.id, { ...block.data, headers: nextHeaders, rows: nextRows });
              }}
            >
              - Last Column
            </button>
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
              className="text-2xl font-black text-[#111827]"
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(block.data?.cards || []).map((card: any, idx: number) => (
              <div key={`${block.id}-card-${idx}`} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                <div className="font-black text-lg text-[#111827]">
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
                <div className="text-xs text-gray-500 mt-2">
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
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm">
          <EditableText
            tag="h2"
            value={getLocalized(block.data?.title)}
            onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title, next) })}
            className="text-xl font-black mb-4 text-[#111827]"
            placeholder="Guide title"
          />
          <EditableText
            tag="div"
            value={getLocalized(block.data?.content)}
            onChange={(next) => updateBlock(block.id, { ...block.data, content: setLocalized(block.data.content, next) })}
            className="text-sm text-gray-600 whitespace-pre-wrap"
            placeholder="Guide content"
          />
        </div>
      );
    }

    if (block.type === 'faq') {
      return (
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm">
          <EditableText
            tag="h3"
            value={getLocalized(block.data?.title || '')}
            onChange={(next) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title || '', next) })}
            className="text-xl font-black mb-4 text-[#111827]"
            placeholder="FAQ title"
          />
          <div className="space-y-3 text-sm text-gray-600">
            {(block.data?.items || []).map((item: any, idx: number) => (
              <div key={`${block.id}-faq-${idx}`}>
                <div className="font-semibold text-[#111827]">
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
        <div className="rounded-2xl bg-[#E8F5EC] border border-[#D1E7D8] p-5 flex items-center justify-between gap-4">
          <EditableText
            tag="div"
            value={getLocalized(block.data?.label)}
            onChange={(next) => updateBlock(block.id, { ...block.data, label: setLocalized(block.data.label, next) })}
            className="font-semibold text-[#0f172a]"
            placeholder="CTA label"
          />
        </div>
      );
    }

    if (block.type === 'restaurant') {
      return (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl overflow-hidden relative">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black mb-1 text-[#111827]">
              <EditableText
                tag="span"
                value={getLocalized(block.data?.name)}
                onChange={(next) => updateBlock(block.id, { ...block.data, name: setLocalized(block.data.name, next) })}
                placeholder="Restaurant name"
              />
            </h2>
            <div className="text-gray-400 text-lg font-medium mb-4">
              <EditableText
                tag="span"
                value={getLocalized(block.data?.location || '')}
                onChange={(next) => updateBlock(block.id, { ...block.data, location: setLocalized(block.data.location || '', next) })}
                placeholder="Location"
              />
            </div>
            <div className="bg-[#E8F5EC] border-s-4 border-[#22C55E] p-4 rounded-xl">
              <EditableText
                tag="div"
                value={getLocalized(block.data?.description || '')}
                onChange={(next) => updateBlock(block.id, { ...block.data, description: setLocalized(block.data.description || '', next) })}
                className="text-sm text-[#0f172a]/80"
                placeholder="Description"
              />
            </div>
          </div>
        </div>
      );
    }

    if (block.type === 'image') {
      return block.data?.url ? (
        <img src={block.data.url} alt="" className="rounded-2xl w-full object-cover" />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-xs text-gray-400">Image block</div>
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
        <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] p-4 text-gray-500">
          Map block (edit URL in Panel)
        </div>
      );
    }

    if (block.type === 'video') {
      return (
        <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] p-4 text-gray-500">
          Video block (edit URL in Panel)
        </div>
      );
    }

    return null;
  };

  const renderInspector = (block: Block) => {
    if (block.type === 'heading') {
      return (
        <div className="space-y-3">
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
        </div>
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
            <button className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10" onClick={() => openMedia({ type: 'image', blockId: block.id })}>
              Choose from Media
            </button>
            <input type="file" accept="image/*" className="text-xs text-gray-300" onChange={(e) => handleUpload(block.id, (url) => updateBlock(block.id, { ...block.data, url }), e.target.files?.[0])} />
          </div>
          {uploading[block.id] && <div className="text-xs text-gray-400">Uploading...</div>}
        </div>
      );
    }

    if (block.type === 'gallery') {
      return (
        <div className="space-y-2">
          {block.data.urls.map((url: string, idx: number) => (
            <div key={`${block.id}-url-${idx}`} className="flex items-center gap-2">
              <input
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder={`Image URL ${idx + 1}`}
                value={url}
                onChange={(e) => {
                  const next = [...block.data.urls];
                  next[idx] = e.target.value;
                  updateBlock(block.id, { ...block.data, urls: next });
                }}
              />
              <button
                className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200"
                onClick={() => {
                  const next = block.data.urls.filter((_u: string, i: number) => i !== idx);
                  updateBlock(block.id, { ...block.data, urls: next.length ? next : [''] });
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="text-xs text-[#22C55E]" onClick={() => updateBlock(block.id, { ...block.data, urls: [...block.data.urls, ''] })}>
            + Add image
          </button>
          <button className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10" onClick={() => openMedia({ type: 'gallery', blockId: block.id })}>
            Choose from Media
          </button>
          <input type="file" accept="image/*" className="w-full text-xs text-gray-300" onChange={(e) => handleUpload(block.id, (url) => updateBlock(block.id, { ...block.data, urls: [...block.data.urls, url] }), e.target.files?.[0])} />
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

    if (block.type === 'restaurant') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Rank" value={block.data.rank ?? ''} onChange={(e) => updateBlock(block.id, { ...block.data, rank: Number(e.target.value || 0) })} />
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Rating (e.g. 4.9)" value={block.data.rating ?? ''} onChange={(e) => updateBlock(block.id, { ...block.data, rating: Number(e.target.value || 0) })} />
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Reviews count" value={block.data.reviews ?? ''} onChange={(e) => updateBlock(block.id, { ...block.data, reviews: Number(e.target.value || 0) })} />
          </div>
          <input className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Cover image URL" value={block.data.coverUrl || block.data.cover_image_url || block.data.imageUrl || block.data.image || ''} onChange={(e) => updateBlock(block.id, { ...block.data, coverUrl: e.target.value })} />
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="text-xs text-gray-300"
              onChange={(e) =>
                handleUpload(
                  `${block.id}-restaurant-cover`,
                  (url) => updateBlock(block.id, { ...block.data, coverUrl: url }),
                  e.target.files?.[0]
                )
              }
            />
            {uploading[`${block.id}-restaurant-cover`] && <div className="text-xs text-gray-400">Uploading...</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Address" value={getLocalized(block.data.address || '')} onChange={(e) => updateBlock(block.id, { ...block.data, address: setLocalized(block.data.address || '', e.target.value) })} />
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Hours" value={getLocalized(block.data.hours || '')} onChange={(e) => updateBlock(block.id, { ...block.data, hours: setLocalized(block.data.hours || '', e.target.value) })} />
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Distance" value={getLocalized(block.data.distance || '')} onChange={(e) => updateBlock(block.id, { ...block.data, distance: setLocalized(block.data.distance || '', e.target.value) })} />
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Price range" value={getLocalized(block.data.price || '')} onChange={(e) => updateBlock(block.id, { ...block.data, price: setLocalized(block.data.price || '', e.target.value) })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Map URL" value={block.data.mapUrl || ''} onChange={(e) => updateBlock(block.id, { ...block.data, mapUrl: e.target.value })} />
            <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Phone" value={block.data.phone || ''} onChange={(e) => updateBlock(block.id, { ...block.data, phone: e.target.value })} />
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

    if (block.type === 'summary') {
      return (
        <div className="space-y-2">
          {(block.data.items || []).map((_item: any, idx: number) => (
            <button
              key={`${block.id}-summary-remove-${idx}`}
              className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200 me-2"
              onClick={() => {
                const next = block.data.items.filter((_v: any, i: number) => i !== idx);
                updateBlock(block.id, { ...block.data, items: next.length ? next : [''] });
              }}
            >
              Remove item {idx + 1}
            </button>
          ))}
          <button className="text-xs text-[#22C55E]" onClick={() => updateBlock(block.id, { ...block.data, items: [...block.data.items, ''] })}>
            + Add item
          </button>
        </div>
      );
    }

    if (block.type === 'comparison') {
      const headers = block.data?.headers || [];
      const rows = block.data?.rows || [];
      return (
        <div className="space-y-3">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Table title"
            value={getLocalized(block.data.title || '')}
            onChange={(e) => updateBlock(block.id, { ...block.data, title: setLocalized(block.data.title || '', e.target.value) })}
          />
          <div className="text-xs text-gray-400">Edit table from Inspector</div>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {headers.map((header: any, idx: number) => (
                    <th key={`${block.id}-header-edit-${idx}`} className="p-2 align-top min-w-[130px]">
                      <input
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-xs"
                        placeholder={`Header ${idx + 1}`}
                        value={getLocalized(header)}
                        onChange={(e) => {
                          const nextHeaders = [...headers];
                          nextHeaders[idx] = setLocalized(header, e.target.value);
                          updateBlock(block.id, { ...block.data, headers: nextHeaders });
                        }}
                      />
                      <button
                        className="mt-1 text-[10px] px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200"
                        onClick={() => {
                          const nextHeaders = headers.filter((_v: any, i: number) => i !== idx);
                          const nextRows = rows.map((row: any[]) => row.filter((_v: any, i: number) => i !== idx));
                          updateBlock(block.id, { ...block.data, headers: nextHeaders.length ? nextHeaders : [''], rows: nextRows });
                        }}
                      >
                        Remove col
                      </button>
                    </th>
                  ))}
                  <th className="p-2 text-gray-500 min-w-[90px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any[], rowIdx: number) => (
                  <tr key={`${block.id}-row-edit-${rowIdx}`} className="border-t border-white/10">
                    {headers.map((_header: any, colIdx: number) => (
                      <td key={`${block.id}-cell-edit-${rowIdx}-${colIdx}`} className="p-2">
                        <input
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-xs"
                          placeholder={`R${rowIdx + 1} C${colIdx + 1}`}
                          value={getLocalized(row[colIdx] || '')}
                          onChange={(e) => {
                            const nextRows = rows.map((r: any[]) => [...r]);
                            nextRows[rowIdx][colIdx] = setLocalized(row[colIdx] || '', e.target.value);
                            updateBlock(block.id, { ...block.data, rows: nextRows });
                          }}
                        />
                      </td>
                    ))}
                    <td className="p-2">
                      <button
                        className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200"
                        onClick={() => {
                          const nextRows = rows.filter((_v: any, i: number) => i !== rowIdx);
                          updateBlock(block.id, { ...block.data, rows: nextRows.length ? nextRows : [Array(headers.length).fill('')] });
                        }}
                      >
                        Remove row
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="text-xs text-[#22C55E]" onClick={() => updateBlock(block.id, { ...block.data, headers: [...headers, ''], rows: rows.map((row: any[]) => [...row, '']) })}>
            + Add header
          </button>
          <button className="text-xs text-[#22C55E]" onClick={() => updateBlock(block.id, { ...block.data, rows: [...rows, Array(headers.length).fill('')] })}>
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
          {(block.data.cards || []).map((card: any, idx: number) => (
            <div key={`${block.id}-card-${idx}`} className="grid grid-cols-1 md:grid-cols-5 gap-2">
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
                {[
                  { value: 'Star', label: 'نجمة' },
                  { value: 'Sparkles', label: 'لمعة' },
                  { value: 'Crown', label: 'تاج' },
                  { value: 'TrendingUp', label: 'صاعد' },
                  { value: 'BadgeCheck', label: 'شارة موثوقة' },
                  { value: 'Leaf', label: 'ورقة' },
                  { value: 'MapPin', label: 'موقع' },
                  { value: 'Zap', label: 'برق' }
                ].map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
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
              <button
                className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200"
                onClick={() => {
                  const next = block.data.cards.filter((_v: any, i: number) => i !== idx);
                  updateBlock(block.id, {
                    ...block.data,
                    cards: next.length ? next : [{ title: { ar: '', en: '' }, label: { ar: '', en: '' }, note: { ar: '', en: '' }, icon: 'Star' }]
                  });
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="text-xs text-[#22C55E]"
            onClick={() =>
              updateBlock(block.id, {
                ...block.data,
                cards: [...block.data.cards, { title: { ar: '', en: '' }, label: { ar: '', en: '' }, note: { ar: '', en: '' }, icon: 'Star' }]
              })
            }
          >
            + Add card
          </button>
        </div>
      );
    }

    if (block.type === 'faq') {
      return (
        <div className="space-y-2">
          {(block.data.items || []).map((_item: any, idx: number) => (
            <button
              key={`${block.id}-faq-remove-${idx}`}
              className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200 me-2"
              onClick={() => {
                const next = block.data.items.filter((_v: any, i: number) => i !== idx);
                updateBlock(block.id, { ...block.data, items: next.length ? next : [{ q: '', a: '' }] });
              }}
            >
              Remove QA {idx + 1}
            </button>
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

    return null;
  };

  return (
    <div className="admin-shell min-h-screen bg-[#F9FAFB] text-[#111827]">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="font-black">{contentLang === 'ar' ? 'محرر المقال' : 'Post Builder'}</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setContentLang('ar')} className={`px-3 py-1 rounded-full text-xs ${contentLang === 'ar' ? 'bg-primary text-[#0f172a]' : 'bg-[#F3F4F6] text-[#111827]'}`}>
              AR
            </button>
            <button onClick={() => setContentLang('en')} className={`px-3 py-1 rounded-full text-xs ${contentLang === 'en' ? 'bg-primary text-[#0f172a]' : 'bg-[#F3F4F6] text-[#111827]'}`}>
              EN
            </button>
            <button onClick={undo} disabled={!canUndo} className="bg-[#F3F4F6] text-[#111827] px-3 py-1.5 rounded-full text-xs border border-[#E5E7EB] hover:bg-[#E5E7EB] transition disabled:opacity-40 disabled:cursor-not-allowed">
              Undo
            </button>
            <button
              onClick={() => importInputRef.current?.click()}
              className="bg-[#F3F4F6] text-[#111827] px-3 py-1.5 rounded-full text-xs border border-[#E5E7EB] hover:bg-[#E5E7EB] transition"
            >
              Import JSON
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json,text/plain"
              className="hidden"
              onChange={(e) => {
                importFromJsonFile(e.target.files?.[0]);
                e.currentTarget.value = '';
              }}
            />
            <button onClick={() => onPreview({ values: latestValuesRef.current, lang: contentLang, blocks })} className="bg-[#F3F4F6] text-[#111827] px-3 py-1.5 rounded-full text-xs border border-[#E5E7EB] hover:bg-[#E5E7EB] transition">
              Preview
            </button>
            {onPreviewPublic && (
              <button
                onClick={() => onPreviewPublic({ values: latestValuesRef.current, lang: contentLang, blocks })}
                className="bg-[#F3F4F6] text-[#111827] px-3 py-1.5 rounded-full text-xs border border-[#E5E7EB] hover:bg-[#E5E7EB] transition"
              >
                Preview (Site)
              </button>
            )}
            <button onClick={onSaveDraft} className="bg-[#F3F4F6] text-[#111827] px-3 py-1.5 rounded-full text-xs border border-[#E5E7EB] hover:bg-[#E5E7EB] transition">
              Save Draft
            </button>
            <button onClick={onPublish} className="bg-primary text-[#0f172a] px-3 py-1.5 rounded-full text-xs font-semibold">
              Publish
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600">Category</div>
              <select
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  className="sm:col-span-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                  placeholder="New Category AR"
                  value={newCategoryAr}
                  onChange={(e) => setNewCategoryAr(e.target.value)}
                />
                <input
                  className="sm:col-span-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                  placeholder="New Category EN"
                  value={newCategoryEn}
                  onChange={(e) => setNewCategoryEn(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory || !newCategoryAr.trim() || !newCategoryEn.trim()}
                  className="bg-primary text-[#0f172a] rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  {creatingCategory ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600">Tags</div>
              <div className="max-h-28 overflow-auto rounded-lg border border-[#E5E7EB] p-2 bg-[#F9FAFB]">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const active = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1 rounded-full text-xs border ${
                          active
                            ? 'bg-[#22C55E]/20 border-[#22C55E]/30 text-[#14532d]'
                            : 'bg-white border-[#E5E7EB] text-gray-600'
                        }`}
                      >
                        {tag.name_en || tag.name_ar}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  className="sm:col-span-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                  placeholder="New Tag AR"
                  value={newTagAr}
                  onChange={(e) => setNewTagAr(e.target.value)}
                />
                <input
                  className="sm:col-span-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                  placeholder="New Tag EN"
                  value={newTagEn}
                  onChange={(e) => setNewTagEn(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={creatingTag || !newTagAr.trim() || !newTagEn.trim()}
                  className="bg-primary text-[#0f172a] rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  {creatingTag ? 'Adding...' : 'Add Tag'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-8">
          <section className="relative overflow-hidden rounded-3xl bg-[#111827] text-white border border-white/10">
            {values.cover_image_url && <img src={values.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
            <div className="relative z-10 px-6 py-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#22C55E]/20 text-[#22C55E] px-4 py-1.5 text-xs font-bold border border-[#22C55E]/30">
                {contentLang === 'ar' ? 'محدث باستمرار' : 'Continuously updated'}
              </div>
              <h1 className="mt-6 text-3xl md:text-6xl font-black leading-tight">
                <EditableText
                  tag="span"
                  value={contentLang === 'ar' ? values.title_ar || '' : values.title_en || ''}
                  onChange={(next) => update(contentLang === 'ar' ? 'title_ar' : 'title_en', next)}
                  placeholder="Title"
                  className="text-white"
                />
              </h1>
              <p className="mt-4 text-white/80 text-sm md:text-lg max-w-3xl mx-auto">
                <EditableText
                  tag="span"
                  value={contentLang === 'ar' ? values.excerpt_ar || '' : values.excerpt_en || ''}
                  onChange={(next) => update(contentLang === 'ar' ? 'excerpt_ar' : 'excerpt_en', next)}
                  placeholder="Excerpt"
                  className="text-white/80"
                />
              </p>
            </div>
          </section>

          <section className="space-y-6">
            {blocks.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => setDragId(block.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dragId && moveBlock(dragId, block.id)}
                onClick={() => setSelectedId(block.id)}
                className={[
                  'rounded-2xl border p-4 bg-white transition cursor-pointer',
                  selectedId === block.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-[#E5E7EB]'
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-3">
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
                      className="text-[10px] text-red-400"
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
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 shadow-sm">
            <div className="text-xs text-gray-400 mb-3">Add Block</div>
            <div className="space-y-2">
              {widgets.map((w) => (
                <button
                  key={w.type}
                  onClick={() => addBlock(w.type as Block['type'])}
                  className="w-full text-start px-3 py-2 rounded-lg bg-[#F9FAFB] text-xs hover:bg-gray-100 transition"
                >
                  + {w.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 shadow-sm">
            <div className="text-xs text-gray-400 mb-3">Inspector</div>
            {!selectedId ? (
              <div className="text-xs text-gray-400">Select a block to edit.</div>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-3">Editing: {blocks.find((b) => b.id === selectedId)?.type}</div>
                {blocks
                  .filter((b) => b.id === selectedId)
                  .map((block) => (
                    <div key={block.id} className="space-y-3">
                      {renderInspector(block)}
                    </div>
                  ))}
              </>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 shadow-sm">
              <div className="text-xs text-gray-400 mb-3">Post Settings</div>
              <input className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Cover Image URL" value={values.cover_image_url || ''} onChange={(e) => update('cover_image_url', e.target.value)} />
              <div className="flex items-center gap-2 mt-2">
                <button className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10" onClick={() => openMedia({ type: 'cover' })}>
                  Choose from Media
                </button>
                <input type="file" accept="image/*" className="text-xs text-gray-300" onChange={(e) => handleUpload('cover', (url) => update('cover_image_url', url), e.target.files?.[0])} />
              </div>

              <div className="mt-3 text-xs text-gray-400 mb-2">SEO / Meta</div>
              <input className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="SEO Title (AR)" value={values.seo_title_ar || ''} onChange={(e) => update('seo_title_ar', e.target.value)} />
              <input className="w-full mt-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="SEO Title (EN)" value={values.seo_title_en || ''} onChange={(e) => update('seo_title_en', e.target.value)} />
              <textarea rows={3} className="w-full mt-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="SEO Description (AR)" value={values.seo_desc_ar || ''} onChange={(e) => update('seo_desc_ar', e.target.value)} />
              <textarea rows={3} className="w-full mt-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="SEO Description (EN)" value={values.seo_desc_en || ''} onChange={(e) => update('seo_desc_en', e.target.value)} />
          </div>
        </aside>
      </div>

      {showMedia && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 max-w-4xl w-[90%]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-white">Media Library</div>
              <button onClick={() => setShowMedia(false)} className="text-xs text-gray-300">
                Close
              </button>
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
                  setMediaFiles((prev) => [{ name: file.name, url: result.url }, ...prev]);
                }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto">
              {mediaFiles.map((file) => (
                <button
                  key={file.url}
                  onClick={() => pickMedia(file.url)}
                  className="group border border-white/10 rounded-xl overflow-hidden hover:border-primary transition"
                >
                  <img src={file.url} alt={file.name} className="w-full h-28 object-cover group-hover:scale-105 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostBuilder;
