import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../services/api';

const PostsListPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch((e) => {
        setPosts([]);
        setError(e?.message || 'Failed to load posts');
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const title = `${post.title_en || ''} ${post.title_ar || ''}`.toLowerCase();
      const excerpt = `${post.excerpt_en || ''} ${post.excerpt_ar || ''}`.toLowerCase();
      const matchesQuery = !q || title.includes(q) || excerpt.includes(q);
      const matchesStatus = status === 'ALL' || post.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [posts, query, status]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Posts</h1>
          <p className="text-xs text-gray-300 mt-1">Manage drafts, reviews, and published content.</p>
        </div>
        <Link to="/admin/posts/create" className="bg-primary text-[#0f172a] px-4 py-2 rounded-lg text-sm font-semibold">Create</Link>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
          placeholder="Search by title or excerpt..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {['ALL', 'DRAFT', 'REVIEW', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="text-xs text-red-300 mb-3">{error}</div>}
      <div className="space-y-3">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-white/30 transition gap-6">
            <div className="min-w-0">
              <div className="font-semibold">{post.title_en || post.title_ar}</div>
              <div className="text-xs text-gray-300 mt-1 truncate">{post.excerpt_en || post.excerpt_ar || '—'}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] px-3 py-1 rounded-full bg-white/10 border border-white/10">{post.status}</span>
              <Link to={`/admin/posts/edit/${post.id}`} className="text-xs underline">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsListPage;
