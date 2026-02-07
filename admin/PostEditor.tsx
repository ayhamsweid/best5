import React, { useEffect, useMemo, useState } from 'react';

interface PostEditorProps {
  values: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}

type Block =
  | { id: string; type: 'heading'; data: { text: string; level: number } }
  | { id: string; type: 'paragraph'; data: { text: string } }
  | { id: string; type: 'image'; data: { url: string; caption?: string } }
  | { id: string; type: 'gallery'; data: { urls: string[] } }
  | { id: string; type: 'map'; data: { embedUrl: string } }
  | { id: string; type: 'video'; data: { embedUrl: string } }
  | { id: string; type: 'cta'; data: { label: string; url: string } }
  | { id: string; type: 'summary'; data: { title: string; items: string[] } }
  | { id: string; type: 'comparison'; data: { headers: string[]; rows: string[][] } }
  | { id: string; type: 'cards'; data: { cards: Array<{ title: string; score?: string; note?: string }> } };

const makeId = () => Math.random().toString(36).slice(2);

const defaultBlocks = (): Block[] => [
  { id: makeId(), type: 'heading', data: { text: 'عنوان القسم', level: 2 } },
  { id: makeId(), type: 'paragraph', data: { text: 'اكتب النص هنا...' } }
];

const PostEditor: React.FC<PostEditorProps> = ({ values, onChange }) => {
  const update = (key: string, value: any) => onChange({ ...values, [key]: value });
  const [blocks, setBlocks] = useState<Block[]>(() => values.content_blocks_json || defaultBlocks());
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    setBlocks(values.content_blocks_json || defaultBlocks());
  }, [values.content_blocks_json]);

  useEffect(() => {
    update('content_blocks_json', blocks);
  }, [blocks]);

  const widgets = useMemo(
    () => [
      { type: 'paragraph', label: 'Paragraph' },
      { type: 'heading', label: 'Heading' },
      { type: 'image', label: 'Image' },
      { type: 'gallery', label: 'Gallery' },
      { type: 'map', label: 'Map' },
      { type: 'video', label: 'Video' },
      { type: 'cta', label: 'CTA Button' },
      { type: 'summary', label: 'Quick Summary' },
      { type: 'comparison', label: 'Comparison Table' },
      { type: 'cards', label: 'Rating Cards' }
    ],
    []
  );

  const addBlock = (type: Block['type']) => {
    const block: Block =
      type === 'heading'
        ? { id: makeId(), type, data: { text: '', level: 2 } }
        : type === 'paragraph'
        ? { id: makeId(), type, data: { text: '' } }
        : type === 'image'
        ? { id: makeId(), type, data: { url: '', caption: '' } }
        : type === 'gallery'
        ? { id: makeId(), type, data: { urls: [''] } }
        : type === 'map'
        ? { id: makeId(), type, data: { embedUrl: '' } }
        : type === 'video'
        ? { id: makeId(), type, data: { embedUrl: '' } }
        : type === 'cta'
        ? { id: makeId(), type, data: { label: '', url: '' } }
        : type === 'comparison'
        ? { id: makeId(), type, data: { headers: ['#', 'الاسم', 'التقييم'], rows: [['1', '', '']] } }
        : type === 'cards'
        ? { id: makeId(), type, data: { cards: [{ title: '', score: '', note: '' }] } }
        : { id: makeId(), type: 'summary', data: { title: '', items: [''] } };
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Title (AR)" value={values.title_ar || ''} onChange={(e) => update('title_ar', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Title (EN)" value={values.title_en || ''} onChange={(e) => update('title_en', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Excerpt (AR)" value={values.excerpt_ar || ''} onChange={(e) => update('excerpt_ar', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Excerpt (EN)" value={values.excerpt_en || ''} onChange={(e) => update('excerpt_en', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
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
                <div className="text-xs text-gray-300 uppercase">{block.type}</div>
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
                    value={block.data.text}
                    onChange={(e) => updateBlock(block.id, { ...block.data, text: e.target.value })}
                  />
                </div>
              )}

              {block.type === 'paragraph' && (
                <textarea
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[120px]"
                  placeholder="Write paragraph..."
                  value={block.data.text}
                  onChange={(e) => updateBlock(block.id, { ...block.data, text: e.target.value })}
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
                  <input
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Caption"
                    value={block.data.caption || ''}
                    onChange={(e) => updateBlock(block.id, { ...block.data, caption: e.target.value })}
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
                    value={block.data.label}
                    onChange={(e) => updateBlock(block.id, { ...block.data, label: e.target.value })}
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
                    value={block.data.title}
                    onChange={(e) => updateBlock(block.id, { ...block.data, title: e.target.value })}
                  />
                  {block.data.items.map((item: string, idx: number) => (
                    <input
                      key={`${block.id}-item-${idx}`}
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      placeholder={`Item ${idx + 1}`}
                      value={item}
                      onChange={(e) => {
                        const next = [...block.data.items];
                        next[idx] = e.target.value;
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
                  <div className="text-xs text-gray-300">Headers</div>
                  {block.data.headers.map((h: string, idx: number) => (
                    <input
                      key={`${block.id}-h-${idx}`}
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      placeholder={`Header ${idx + 1}`}
                      value={h}
                      onChange={(e) => {
                        const next = [...block.data.headers];
                        next[idx] = e.target.value;
                        updateBlock(block.id, { ...block.data, headers: next });
                      }}
                    />
                  ))}
                  <button
                    className="text-xs text-[#22C55E]"
                    onClick={() => updateBlock(block.id, { ...block.data, headers: [...block.data.headers, ''] })}
                  >
                    + Add header
                  </button>
                  <div className="text-xs text-gray-300 mt-3">Rows</div>
                  {block.data.rows.map((row: string[], rowIdx: number) => (
                    <div key={`${block.id}-r-${rowIdx}`} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {block.data.headers.map((_h: string, colIdx: number) => (
                        <input
                          key={`${block.id}-r-${rowIdx}-${colIdx}`}
                          className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                          placeholder={`Row ${rowIdx + 1} Col ${colIdx + 1}`}
                          value={row[colIdx] || ''}
                          onChange={(e) => {
                            const rows = block.data.rows.map((r: string[]) => [...r]);
                            rows[rowIdx][colIdx] = e.target.value;
                            updateBlock(block.id, { ...block.data, rows });
                          }}
                        />
                      ))}
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
                  {block.data.cards.map((card: any, idx: number) => (
                    <div key={`${block.id}-card-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                        placeholder="Title"
                        value={card.title}
                        onChange={(e) => {
                          const next = [...block.data.cards];
                          next[idx] = { ...card, title: e.target.value };
                          updateBlock(block.id, { ...block.data, cards: next });
                        }}
                      />
                      <input
                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                        placeholder="Score"
                        value={card.score || ''}
                        onChange={(e) => {
                          const next = [...block.data.cards];
                          next[idx] = { ...card, score: e.target.value };
                          updateBlock(block.id, { ...block.data, cards: next });
                        }}
                      />
                      <input
                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                        placeholder="Note"
                        value={card.note || ''}
                        onChange={(e) => {
                          const next = [...block.data.cards];
                          next[idx] = { ...card, note: e.target.value };
                          updateBlock(block.id, { ...block.data, cards: next });
                        }}
                      />
                    </div>
                  ))}
                  <button
                    className="text-xs text-[#22C55E]"
                    onClick={() =>
                      updateBlock(block.id, { ...block.data, cards: [...block.data.cards, { title: '', score: '', note: '' }] })
                    }
                  >
                    + Add card
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

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
    </div>
  );
};

export default PostEditor;
