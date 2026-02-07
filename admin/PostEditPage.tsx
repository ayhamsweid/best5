import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostEditor from './PostEditor';
import { fetchPost, updatePost } from '../services/api';

const PostEditPage: React.FC = () => {
  const { id } = useParams();
  const [values, setValues] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPost(id).then(setValues).catch(() => setValues({}));
  }, [id]);

  const onSave = async (override?: Record<string, any>) => {
    if (!id) return;
    setError(null);
    try {
      const payload = { ...values, ...override };
      const post = await updatePost(id, payload);
      setValues(post);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    }
  };

  const onPreview = () => {
    const slugAr = values.slug_ar;
    const slugEn = values.slug_en;
    const slug = slugAr || slugEn;
    if (!slug) return;
    const lang = slugAr ? 'ar' : 'en';
    window.open(`/${lang}/blog/${slug}`, '_blank');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Edit Post</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onPreview}
            className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm border border-white/10 hover:bg-white/20 transition"
          >
            Preview
          </button>
          <button
            onClick={() => onSave({ status: 'DRAFT' })}
            className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm border border-white/10 hover:bg-white/20 transition"
          >
            Save Draft
          </button>
          <button
            onClick={() => onSave({ status: 'PUBLISHED', published_at: new Date().toISOString() })}
            className="bg-primary text-[#0f172a] px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Publish Now
          </button>
        </div>
      </div>
      {error && <div className="text-xs text-red-300 mb-3">{error}</div>}
      <PostEditor values={values} onChange={setValues} />
    </div>
  );
};

export default PostEditPage;
