import React, { useEffect, useMemo, useState } from 'react';
import { fetchPublicPosts } from '../services/api';

interface RelatedPostsSelectorProps {
  postId?: string;
  value?: string[];
  onChange: (ids: string[]) => void;
}

const RelatedPostsSelector: React.FC<RelatedPostsSelectorProps> = ({
  postId,
  value = [],
  onChange
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [candidateId, setCandidateId] = useState('');

  useEffect(() => {
    fetchPublicPosts('en')
      .then((items: any) => setPosts(Array.isArray(items) ? items : []))
      .catch(() => setPosts([]));
  }, []);

  const byId = useMemo(
    () => new Map(posts.map((post) => [post.id, post])),
    [posts]
  );
  const selectedIds = [...new Set((Array.isArray(value) ? value : []).filter(Boolean))].slice(0, 4);
  const available = posts.filter(
    (post) => post.id !== postId && !selectedIds.includes(post.id)
  );

  const move = (index: number, offset: number) => {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= selectedIds.length) return;
    const next = [...selectedIds];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-1 text-sm font-semibold">Manual related articles</div>
      <p className="mb-4 text-xs text-gray-400">
        Choose up to 4 published articles. They appear in this order; empty slots are filled automatically.
      </p>

      <div className="space-y-2">
        {selectedIds.map((id, index) => {
          const post = byId.get(id);
          return (
            <div
              key={id}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2"
            >
              <span className="w-6 text-xs font-bold text-gray-400">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm">
                {post?.title_en || post?.title_ar || id}
              </span>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded px-2 py-1 text-xs disabled:opacity-30"
                aria-label="Move related article up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === selectedIds.length - 1}
                className="rounded px-2 py-1 text-xs disabled:opacity-30"
                aria-label="Move related article down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(selectedIds.filter((selectedId) => selectedId !== id))}
                className="rounded px-2 py-1 text-xs text-red-300"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {selectedIds.length < 4 && (
        <div className="mt-3 flex gap-2">
          <select
            value={candidateId}
            onChange={(event) => setCandidateId(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm"
          >
            <option value="">Select a published article</option>
            {available.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title_en || post.title_ar}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!candidateId}
            onClick={() => {
              if (!candidateId) return;
              onChange([...selectedIds, candidateId]);
              setCandidateId('');
            }}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}
    </section>
  );
};

export default RelatedPostsSelector;
