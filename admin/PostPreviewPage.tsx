import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchPost } from '../services/api';
import BlogDetailPage from '../pages/BlogDetailPage';

const PostPreviewPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const langParam = searchParams.get('lang') === 'en' ? 'en' : 'ar';
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
    fetchPost(id).then(setPost).catch(() => setPost(null));
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0b1224] text-white flex items-center justify-center">
        <div className="text-sm text-gray-300">Loading preview...</div>
      </div>
    );
  }

  return <BlogDetailPage overridePost={post} overrideLang={langParam} />;
};

export default PostPreviewPage;
