import React, { useEffect, useMemo, useState } from 'react';
import { createCategory, fetchCategories, updateCategory } from '../services/api';
import ConfiguredIcon, { resolveIconName, supportedIconNames } from '../components/ConfiguredIcon';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slugAr, setSlugAr] = useState('');
  const [slugEn, setSlugEn] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const onCreate = async () => {
    setError(null);
    if (!nameAr.trim() || !nameEn.trim()) {
      setError('Both Arabic and English names are required.');
      return;
    }
    setSaving(true);
    try {
      const created = await createCategory({
        name_ar: nameAr.trim(),
        name_en: nameEn.trim(),
        ...(slugAr.trim() ? { slug_ar: slugAr.trim() } : {}),
        ...(slugEn.trim() ? { slug_en: slugEn.trim() } : {}),
        icon: icon.trim() || null
      });
      setCategories((prev) => [created, ...prev]);
      setNameAr('');
      setNameEn('');
      setSlugAr('');
      setSlugEn('');
      setIcon('');
    } catch (e: any) {
      setError(e?.message || 'Failed to add category.');
    } finally {
      setSaving(false);
    }
  };

  const renderIcon = (value?: string | null) => {
    return <ConfiguredIcon value={value} className="w-5 h-5" />;
  };

  const startEdit = (category: any) => {
    setEditingId(category.id);
    setEditValues({
      name_ar: category.name_ar || '',
      name_en: category.name_en || '',
      slug_ar: category.slug_ar || '',
      slug_en: category.slug_en || '',
      seo_title_ar: category.seo_title_ar || '',
      seo_title_en: category.seo_title_en || '',
      seo_desc_ar: category.seo_desc_ar || '',
      seo_desc_en: category.seo_desc_en || '',
      intro_ar: category.intro_ar || '',
      intro_en: category.intro_en || '',
      icon: category.icon || ''
    });
    setError(null);
  };

  const onUpdate = async () => {
    if (!editingId) return;
    setError(null);
    if (!editValues.name_ar?.trim() || !editValues.name_en?.trim()) {
      setError('Both Arabic and English names are required.');
      return;
    }
    if (!editValues.slug_ar?.trim() || !editValues.slug_en?.trim()) {
      setError('Both Arabic and English descriptive slugs are required.');
      return;
    }
    setSaving(true);
    try {
      const updated: any = await updateCategory(editingId, {
        name_ar: editValues.name_ar.trim(),
        name_en: editValues.name_en.trim(),
        slug_ar: editValues.slug_ar.trim(),
        slug_en: editValues.slug_en.trim(),
        seo_title_ar: editValues.seo_title_ar?.trim() || '',
        seo_title_en: editValues.seo_title_en?.trim() || '',
        seo_desc_ar: editValues.seo_desc_ar?.trim() || '',
        seo_desc_en: editValues.seo_desc_en?.trim() || '',
        intro_ar: editValues.intro_ar?.trim() || '',
        intro_en: editValues.intro_en?.trim() || '',
        icon: editValues.icon?.trim() || null
      });
      setCategories((current) => current.map((category) => category.id === updated.id ? updated : category));
      setEditingId(null);
      setEditValues({});
    } catch (e: any) {
      setError(e?.message || 'Failed to update category.');
    } finally {
      setSaving(false);
    }
  };

  const iconHint = useMemo(() => {
    const match = (icon || '').trim();
    if (!match) return 'Lucide icon name (e.g. utensils) or image URL';
    const resolved = resolveIconName(match);
    if (resolved) return `Lucide icon: ${resolved}`;
    if (match.startsWith('http') || match.startsWith('/')) return 'Image URL';
    return 'Unknown icon name';
  }, [icon]);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Categories</h1>
      <div className="flex flex-wrap gap-3 mb-3">
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Name (AR)" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Name (EN)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Slug (AR, optional)" value={slugAr} onChange={(e) => setSlugAr(e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Slug (EN, optional)" value={slugEn} onChange={(e) => setSlugEn(e.target.value)} />
        <div className="flex items-center gap-2">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Icon (e.g. utensils) or URL"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            {renderIcon(icon)}
          </div>
        </div>
        <span className="text-xs text-gray-300 self-center">
          {iconHint} ·{' '}
          <a
            href="https://lucide.dev/icons"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            Supported icons ({supportedIconNames.length})
          </a>
        </span>
        <button
          onClick={onCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
          disabled={saving}
        >
          {saving ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && <div className="text-xs text-red-300 mb-4">{error}</div>}
      <div className="space-y-3">
        {categories.map((cat) => {
          const editing = editingId === cat.id;
          return (
            <div key={cat.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(['name_ar', 'name_en', 'slug_ar', 'slug_en'] as const).map((field) => (
                    <input
                      key={field}
                      className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
                      placeholder={field}
                      value={editValues[field] || ''}
                      onChange={(event) => setEditValues((current) => ({ ...current, [field]: event.target.value }))}
                    />
                  ))}
                  {(['seo_title_ar', 'seo_title_en', 'seo_desc_ar', 'seo_desc_en'] as const).map((field) => (
                    <textarea
                      key={field}
                      rows={field.startsWith('seo_desc') ? 3 : 2}
                      className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
                      placeholder={field}
                      value={editValues[field] || ''}
                      onChange={(event) => setEditValues((current) => ({ ...current, [field]: event.target.value }))}
                    />
                  ))}
                  {(['intro_ar', 'intro_en'] as const).map((field) => {
                    const words = (editValues[field] || '').trim().split(/\s+/).filter(Boolean).length;
                    return (
                      <label key={field} className="space-y-1">
                        <textarea
                          rows={8}
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
                          placeholder={`${field} (150–250 words)`}
                          value={editValues[field] || ''}
                          onChange={(event) => setEditValues((current) => ({ ...current, [field]: event.target.value }))}
                        />
                        <span className={`text-xs ${words && (words < 150 || words > 250) ? 'text-amber-300' : 'text-gray-400'}`}>
                          {words} words
                        </span>
                      </label>
                    );
                  })}
                  <input
                    className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
                    placeholder="Icon"
                    value={editValues.icon || ''}
                    onChange={(event) => setEditValues((current) => ({ ...current, icon: event.target.value }))}
                  />
                  <div className="flex gap-2">
                    <button type="button" disabled={saving} onClick={onUpdate} className="rounded-lg bg-primary px-4 py-2 text-sm disabled:opacity-60">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-lg bg-white/10 px-4 py-2 text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                    {renderIcon(cat.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{cat.name_en || cat.name_ar}</div>
                    <div className="mt-1 truncate text-xs text-gray-400">
                      /ar/category/{cat.slug_ar} · /en/category/{cat.slug_en}
                    </div>
                  </div>
                  <button type="button" onClick={() => startEdit(cat)} className="rounded-lg bg-white/10 px-4 py-2 text-sm">
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
