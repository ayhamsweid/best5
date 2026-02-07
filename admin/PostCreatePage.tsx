import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostEditor from './PostEditor';
import { createPost } from '../services/api';

const PostCreatePage: React.FC = () => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSave = async (override?: Record<string, any>) => {
    setError(null);
    try {
      const payload = { status: 'DRAFT', ...values, ...override };
      const post = await createPost(payload);
      navigate(`/admin/posts/edit/${post.id}`);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Create Post</h1>
        <div className="flex items-center gap-3">
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

export default PostCreatePage;
