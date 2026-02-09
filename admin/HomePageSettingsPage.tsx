import React, { useEffect, useMemo, useState } from 'react';
import { fetchSettings, updateSettings } from '../services/api';

type Localized = { ar?: string; en?: string };

type HomeSettings = {
  hero: {
    title?: Localized;
    subtitle?: Localized;
    description?: Localized;
    placeholder?: Localized;
    cta?: Localized;
    backgroundUrl?: string;
  };
  sections: {
    order: string[];
    enabled: Record<string, boolean>;
  };
  latestPosts: {
    title?: Localized;
    subtitle?: Localized;
    viewAllLabel?: Localized;
  };
  features: {
    heading?: Localized;
    sub?: Localized;
    items: Array<{ title?: Localized; text?: Localized; icon?: string; tone?: string }>;
  };
};

const defaultHomeSettings = (): HomeSettings => ({
  hero: {
    title: { ar: 'دليلك الشامل لتجارب استثنائية', en: 'Your complete guide to exceptional experiences' },
    subtitle: { ar: 'في قلب اسطنبول', en: 'In the heart of Istanbul' },
    description: {
      ar: 'نحن نقوم بالبحث والمقارنة لنقدم لك الأفضل دائماً، دون الحاجة للتنقل بين مئات الصفحات',
      en: 'We research and compare so you always get the best—without jumping between hundreds of pages.'
    },
    placeholder: { ar: 'ماذا تريد أن تستكشف اليوم؟', en: 'What do you want to explore today?' },
    cta: { ar: 'بحث', en: 'Search' },
    backgroundUrl: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop'
  },
  sections: {
    order: ['categories', 'latest', 'features', 'newsletter'],
    enabled: { categories: true, latest: true, features: true, newsletter: true }
  },
  latestPosts: {
    title: { ar: 'أحدث المقالات', en: 'Latest articles' },
    subtitle: { ar: 'آخر ما نشرناه من أدلة ومقارنات', en: 'Fresh guides and comparisons from our editors' },
    viewAllLabel: { ar: 'عرض الكل', en: 'View all' }
  },
  features: {
    heading: { ar: 'لماذا تختار دليل بشكتاش؟', en: 'Why choose Besiktas City Guide?' },
    sub: {
      ar: 'نحن نوفر عليك عناء البحث من خلال تقديم معلومات دقيقة ومحدثة من قلب الحدث.',
      en: 'We save you the hassle of searching by providing accurate, up‑to‑date insights.'
    },
    items: [
      {
        title: { ar: 'اختيارات الخبراء', en: 'Expert picks' },
        text: { ar: 'فريقنا المحلي يقوم بتجربة وتقييم كل مكان بشكل شخصي ومستقل تماماً.', en: 'Our local team tests and reviews every place independently.' },
        icon: 'ShieldCheck',
        tone: 'green'
      },
      {
        title: { ar: 'مقارنات شاملة في صفحة واحدة', en: 'All comparisons in one place' },
        text: { ar: 'نقوم بتجميع الأسعار، الموقع، ساعات العمل، والتقييمات في جداول سهلة القراءة.', en: 'Prices, locations, hours, and ratings in clean, easy tables.' },
        icon: 'ListChecks',
        tone: 'teal'
      },
      {
        title: { ar: 'تحديثات دورية للأسعار', en: 'Regular price updates' },
        text: { ar: 'نتابع تغيرات الأسعار في اسطنبول بشكل أسبوعي لنضمن لك ميزانية دقيقة.', en: 'We track price changes weekly to keep your budget accurate.' },
        icon: 'History',
        tone: 'emerald'
      }
    ]
  }
});

const HomePageSettingsPage: React.FC = () => {
  const [home, setHome] = useState<HomeSettings>(() => defaultHomeSettings());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        const merged = { ...defaultHomeSettings(), ...(data?.home_json || {}) } as HomeSettings;
        merged.sections = {
          order: data?.home_json?.sections?.order || merged.sections.order,
          enabled: { ...merged.sections.enabled, ...(data?.home_json?.sections?.enabled || {}) }
        };
        merged.latestPosts = {
          ...merged.latestPosts,
          ...(data?.home_json?.latestPosts || {})
        };
        merged.features = {
          ...merged.features,
          ...(data?.home_json?.features || {}),
          items: data?.home_json?.features?.items || merged.features.items
        };
        setHome(merged);
      })
      .catch(() => setHome(defaultHomeSettings()));
  }, []);

  const updateHero = (key: keyof HomeSettings['hero'], value: any) =>
    setHome((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));

  const updateLocalized = (target: Localized | undefined, lang: 'ar' | 'en', next: string) => ({
    ...(target || {}),
    [lang]: next
  });

  const moveSection = (key: string, dir: -1 | 1) => {
    setHome((prev) => {
      const order = [...prev.sections.order];
      const idx = order.indexOf(key);
      if (idx === -1) return prev;
      const nextIdx = idx + dir;
      if (nextIdx < 0 || nextIdx >= order.length) return prev;
      const [item] = order.splice(idx, 1);
      order.splice(nextIdx, 0, item);
      return { ...prev, sections: { ...prev.sections, order } };
    });
  };

  const toggleSection = (key: string) => {
    setHome((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        enabled: { ...prev.sections.enabled, [key]: !prev.sections.enabled[key] }
      }
    }));
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ home_json: home });
      setMessage('Saved');
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setSaving(false);
    }
  };

  const sectionLabels = useMemo(
    () => ({
      categories: 'Categories',
      latest: 'Latest Articles',
      features: 'Features',
      newsletter: 'Newsletter'
    }),
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Home Page</h1>
        <div className="flex items-center gap-3">
          {message && <div className="text-xs text-green-300">{message}</div>}
          <button
            onClick={onSave}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <section className="space-y-3">
        <div className="text-sm font-semibold">Hero</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Title (AR)"
            value={home.hero.title?.ar || ''}
            onChange={(e) => updateHero('title', updateLocalized(home.hero.title, 'ar', e.target.value))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Title (EN)"
            value={home.hero.title?.en || ''}
            onChange={(e) => updateHero('title', updateLocalized(home.hero.title, 'en', e.target.value))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Subtitle (AR)"
            value={home.hero.subtitle?.ar || ''}
            onChange={(e) => updateHero('subtitle', updateLocalized(home.hero.subtitle, 'ar', e.target.value))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Subtitle (EN)"
            value={home.hero.subtitle?.en || ''}
            onChange={(e) => updateHero('subtitle', updateLocalized(home.hero.subtitle, 'en', e.target.value))}
          />
          <textarea
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm min-h-[100px]"
            placeholder="Description (AR)"
            value={home.hero.description?.ar || ''}
            onChange={(e) => updateHero('description', updateLocalized(home.hero.description, 'ar', e.target.value))}
          />
          <textarea
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm min-h-[100px]"
            placeholder="Description (EN)"
            value={home.hero.description?.en || ''}
            onChange={(e) => updateHero('description', updateLocalized(home.hero.description, 'en', e.target.value))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Search Placeholder (AR)"
            value={home.hero.placeholder?.ar || ''}
            onChange={(e) => updateHero('placeholder', updateLocalized(home.hero.placeholder, 'ar', e.target.value))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Search Placeholder (EN)"
            value={home.hero.placeholder?.en || ''}
            onChange={(e) => updateHero('placeholder', updateLocalized(home.hero.placeholder, 'en', e.target.value))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="CTA Label (AR)"
            value={home.hero.cta?.ar || ''}
            onChange={(e) => updateHero('cta', updateLocalized(home.hero.cta, 'ar', e.target.value))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="CTA Label (EN)"
            value={home.hero.cta?.en || ''}
            onChange={(e) => updateHero('cta', updateLocalized(home.hero.cta, 'en', e.target.value))}
          />
          <input
            className="md:col-span-2 bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Background Image URL"
            value={home.hero.backgroundUrl || ''}
            onChange={(e) => updateHero('backgroundUrl', e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm font-semibold">Sections</div>
        <div className="space-y-2">
          {home.sections.order.map((key) => (
            <div key={key} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-2">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={!!home.sections.enabled[key]} onChange={() => toggleSection(key)} />
                <span className="text-sm">{sectionLabels[key] || key}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs px-2 py-1 rounded-full bg-white/10" onClick={() => moveSection(key, -1)}>Up</button>
                <button className="text-xs px-2 py-1 rounded-full bg-white/10" onClick={() => moveSection(key, 1)}>Down</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm font-semibold">Latest Articles</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Title (AR)"
            value={home.latestPosts.title?.ar || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                latestPosts: {
                  ...prev.latestPosts,
                  title: updateLocalized(prev.latestPosts.title, 'ar', e.target.value)
                }
              }))
            }
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Title (EN)"
            value={home.latestPosts.title?.en || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                latestPosts: {
                  ...prev.latestPosts,
                  title: updateLocalized(prev.latestPosts.title, 'en', e.target.value)
                }
              }))
            }
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Subtitle (AR)"
            value={home.latestPosts.subtitle?.ar || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                latestPosts: {
                  ...prev.latestPosts,
                  subtitle: updateLocalized(prev.latestPosts.subtitle, 'ar', e.target.value)
                }
              }))
            }
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Subtitle (EN)"
            value={home.latestPosts.subtitle?.en || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                latestPosts: {
                  ...prev.latestPosts,
                  subtitle: updateLocalized(prev.latestPosts.subtitle, 'en', e.target.value)
                }
              }))
            }
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="View All Label (AR)"
            value={home.latestPosts.viewAllLabel?.ar || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                latestPosts: {
                  ...prev.latestPosts,
                  viewAllLabel: updateLocalized(prev.latestPosts.viewAllLabel, 'ar', e.target.value)
                }
              }))
            }
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="View All Label (EN)"
            value={home.latestPosts.viewAllLabel?.en || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                latestPosts: {
                  ...prev.latestPosts,
                  viewAllLabel: updateLocalized(prev.latestPosts.viewAllLabel, 'en', e.target.value)
                }
              }))
            }
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm font-semibold">Features Section</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Heading (AR)"
            value={home.features.heading?.ar || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                features: {
                  ...prev.features,
                  heading: updateLocalized(prev.features.heading, 'ar', e.target.value)
                }
              }))
            }
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Heading (EN)"
            value={home.features.heading?.en || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                features: {
                  ...prev.features,
                  heading: updateLocalized(prev.features.heading, 'en', e.target.value)
                }
              }))
            }
          />
          <textarea
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm min-h-[90px]"
            placeholder="Subheading (AR)"
            value={home.features.sub?.ar || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                features: {
                  ...prev.features,
                  sub: updateLocalized(prev.features.sub, 'ar', e.target.value)
                }
              }))
            }
          />
          <textarea
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm min-h-[90px]"
            placeholder="Subheading (EN)"
            value={home.features.sub?.en || ''}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                features: {
                  ...prev.features,
                  sub: updateLocalized(prev.features.sub, 'en', e.target.value)
                }
              }))
            }
          />
        </div>

        <div className="space-y-4">
          {home.features.items.map((item, idx) => (
            <div key={`feature-${idx}`} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-300">Item #{idx + 1}</div>
                <button
                  className="text-xs text-red-300"
                  onClick={() =>
                    setHome((prev) => ({
                      ...prev,
                      features: {
                        ...prev.features,
                        items: prev.features.items.filter((_, i) => i !== idx)
                      }
                    }))
                  }
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Title (AR)"
                  value={item.title?.ar || ''}
                  onChange={(e) =>
                    setHome((prev) => {
                      const next = [...prev.features.items];
                      next[idx] = { ...item, title: updateLocalized(item.title, 'ar', e.target.value) };
                      return { ...prev, features: { ...prev.features, items: next } };
                    })
                  }
                />
                <input
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Title (EN)"
                  value={item.title?.en || ''}
                  onChange={(e) =>
                    setHome((prev) => {
                      const next = [...prev.features.items];
                      next[idx] = { ...item, title: updateLocalized(item.title, 'en', e.target.value) };
                      return { ...prev, features: { ...prev.features, items: next } };
                    })
                  }
                />
                <textarea
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Text (AR)"
                  value={item.text?.ar || ''}
                  onChange={(e) =>
                    setHome((prev) => {
                      const next = [...prev.features.items];
                      next[idx] = { ...item, text: updateLocalized(item.text, 'ar', e.target.value) };
                      return { ...prev, features: { ...prev.features, items: next } };
                    })
                  }
                />
                <textarea
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Text (EN)"
                  value={item.text?.en || ''}
                  onChange={(e) =>
                    setHome((prev) => {
                      const next = [...prev.features.items];
                      next[idx] = { ...item, text: updateLocalized(item.text, 'en', e.target.value) };
                      return { ...prev, features: { ...prev.features, items: next } };
                    })
                  }
                />
                <input
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Icon (e.g. ShieldCheck)"
                  value={item.icon || ''}
                  onChange={(e) =>
                    setHome((prev) => {
                      const next = [...prev.features.items];
                      next[idx] = { ...item, icon: e.target.value };
                      return { ...prev, features: { ...prev.features, items: next } };
                    })
                  }
                />
                <input
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Tone (green | teal | emerald)"
                  value={item.tone || ''}
                  onChange={(e) =>
                    setHome((prev) => {
                      const next = [...prev.features.items];
                      next[idx] = { ...item, tone: e.target.value };
                      return { ...prev, features: { ...prev.features, items: next } };
                    })
                  }
                />
              </div>
            </div>
          ))}
          <button
            className="text-xs text-[#22C55E]"
            onClick={() =>
              setHome((prev) => ({
                ...prev,
                features: {
                  ...prev.features,
                  items: [...prev.features.items, { title: { ar: '', en: '' }, text: { ar: '', en: '' }, icon: '', tone: 'green' }]
                }
              }))
            }
          >
            + Add feature
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePageSettingsPage;
