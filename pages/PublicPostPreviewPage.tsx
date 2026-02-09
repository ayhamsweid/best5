import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogDetailPage from './BlogDetailPage';
import { fetchPostPreview } from '../services/api';
import { useLang } from '../hooks/useLang';

const PublicPostPreviewPage: React.FC = () => {
  const { id } = useParams();
  const { lang } = useLang();
  const [post, setPost] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    const key = `post_preview_${id}`;
    const raw = sessionStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setPost(parsed);
        return;
      } catch {
        sessionStorage.removeItem(key);
      }
    }
    fetchPostPreview(id)
      .then(setPost)
      .catch(() => setPost(null));
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0b1224] text-white flex items-center justify-center">
        <div className="text-sm text-gray-300">Loading preview...</div>
      </div>
    );
  }

  return <BlogDetailPage overridePost={post} overrideLang={lang} />;
};

export default PublicPostPreviewPage;
