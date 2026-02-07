import React, { useEffect, useState } from 'react';
import { createTag, fetchTags } from '../services/api';

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');

  useEffect(() => {
    fetchTags().then(setTags).catch(() => setTags([]));
  }, []);

  const onCreate = async () => {
    const created = await createTag({ name_ar: nameAr, name_en: nameEn });
    setTags((prev) => [created, ...prev]);
    setNameAr('');
    setNameEn('');
  };

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Tags</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Name (AR)" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Name (EN)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        <button onClick={onCreate} className="bg-primary text-white px-4 py-2 rounded-lg text-sm">Add</button>
      </div>
      <div className="space-y-3">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            {tag.name_en || tag.name_ar}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsPage;
