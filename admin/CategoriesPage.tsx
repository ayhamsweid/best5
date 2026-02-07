import React, { useEffect, useState } from 'react';
import { createCategory, fetchCategories } from '../services/api';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const onCreate = async () => {
    const created = await createCategory({ name_ar: nameAr, name_en: nameEn });
    setCategories((prev) => [created, ...prev]);
    setNameAr('');
    setNameEn('');
  };

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Categories</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Name (AR)" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Name (EN)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        <button onClick={onCreate} className="bg-primary text-white px-4 py-2 rounded-lg text-sm">Add</button>
      </div>
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            {cat.name_en || cat.name_ar}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
