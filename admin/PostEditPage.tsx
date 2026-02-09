import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostBuilder from './PostBuilder';
import { fetchPost, fetchPostRevisions, restorePostRevision, updatePost } from '../services/api';

const PostEditPage: React.FC = () => {
  const { id } = useParams();
  const [values, setValues] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [revMessage, setRevMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPost(id).then(setValues).catch(() => setValues({}));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchPostRevisions(id)
      .then(setRevisions)
      .catch(() => setRevisions([]));
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

  const onPublicPreview = ({
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
    window.open(`/${lang}/preview/${id}`, '_blank');
  };

  return (
    <div>
      {error && <div className="text-xs text-red-300 mb-3">{error}</div>}
      <PostBuilder
        values={values}
        onChange={setValues}
        onPreview={onPreview}
        onPreviewPublic={onPublicPreview}
        onSaveDraft={() => onSave({ status: 'DRAFT' })}
        onPublish={() => onSave({ status: 'PUBLISHED', published_at: new Date().toISOString() })}
      />

      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Revisions</div>
          {revMessage && <div className="text-xs text-green-300">{revMessage}</div>}
        </div>
        {revisions.length ? (
          <div className="space-y-3 text-sm">
            {revisions.map((rev) => (
              <div key={rev.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <div>
                  <div className="text-xs text-gray-300">
                    {new Date(rev.created_at).toLocaleString()} · {rev.editor?.full_name || rev.editor?.email || 'System'}
                  </div>
                </div>
                <button
                  className="text-xs underline"
                  onClick={async () => {
                    if (!id) return;
                    const ok = window.confirm('Restore this revision? Current changes will be overwritten.');
                    if (!ok) return;
                    await restorePostRevision(id, rev.id);
                    const updated = await fetchPost(id);
                    setValues(updated);
                    setRevMessage('Revision restored');
                    setTimeout(() => setRevMessage(null), 2000);
                    const latest = await fetchPostRevisions(id);
                    setRevisions(latest);
                  }}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400">No revisions yet.</div>
        )}
      </div>
    </div>
  );
};

export default PostEditPage;
