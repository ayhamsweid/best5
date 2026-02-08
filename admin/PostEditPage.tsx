import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostBuilder from './PostBuilder';
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

  const onPreview = ({
    values: snapshot,
    blocks,
    lang
  }: {
    values: Record<string, any>;
    blocks: any[];
    lang: 'ar' | 'en';
  }) => {
    if (!id) return;
    const key = `post_preview_${id}`;
    sessionStorage.setItem(key, JSON.stringify({ ...snapshot, content_blocks_json: blocks }));
    window.open(`/admin/posts/preview/${id}?lang=${lang}`, '_blank');
  };

  return (
    <div>
      {error && <div className="text-xs text-red-300 mb-3">{error}</div>}
      <PostBuilder
        values={values}
        onChange={setValues}
        onPreview={onPreview}
        onSaveDraft={() => onSave({ status: 'DRAFT' })}
        onPublish={() => onSave({ status: 'PUBLISHED', published_at: new Date().toISOString() })}
      />
    </div>
  );
};

export default PostEditPage;
