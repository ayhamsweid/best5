import React, { useEffect, useMemo, useState } from 'react';
import { fetchSettings, updateSettings } from '../services/api';
import Markdown from '../components/Markdown';

type Localized = { ar?: string; en?: string };

type PagesConfig = {
  privacy?: Localized;
  contact?: Localized;
  advertise?: Localized;
  terms?: Localized;
  cookies?: Localized;
  faq?: Localized;
};

type PagesMeta = {
  privacy?: { ogImage?: string };
  contact?: { ogImage?: string };
  advertise?: { ogImage?: string };
  terms?: { ogImage?: string };
  cookies?: { ogImage?: string };
  faq?: { ogImage?: string };
};

const defaultPages = (): PagesConfig => ({
  privacy: {
    ar: '## سياسة الخصوصية\n\nنحن نحترم خصوصيتك ونلتزم بحماية بياناتك.\n- لا نشارك بياناتك مع أطراف ثالثة دون إذن.\n- يمكنك طلب حذف بياناتك في أي وقت.\n\nلأي استفسار، تواصل معنا عبر [البريد](mailto:hello@besiktasguide.com).',
    en: '## Privacy Policy\n\nWe respect your privacy and protect your data.\n- We never share your data without permission.\n- You can request deletion at any time.\n\nQuestions? Email us at [hello@besiktasguide.com](mailto:hello@besiktasguide.com).'
  },
  contact: {
    ar: '## تواصل معنا\n\nيسعدنا سماع ملاحظاتك.\n- البريد: hello@besiktasguide.com\n- إنستغرام: [@besiktasguide](https://instagram.com)\n\nسنرد خلال 24-48 ساعة.',
    en: '## Contact Us\n\nWe would love to hear from you.\n- Email: hello@besiktasguide.com\n- Instagram: [@besiktasguide](https://instagram.com)\n\nWe reply within 24-48 hours.'
  },
  advertise: {
    ar: '## أعلن معنا\n\nللعروض الإعلانية والشراكات يرجى التواصل معنا عبر البريد:\n[hello@besiktasguide.com](mailto:hello@besiktasguide.com)\n\nسنرسل لك ملف الأسعار وأمثلة الحملات.',
    en: '## Advertise With Us\n\nFor advertising and partnerships, contact:\n[hello@besiktasguide.com](mailto:hello@besiktasguide.com)\n\nWe will share the media kit and pricing.'
  },
  terms: {
    ar: '## شروط الاستخدام\n\nباستخدامك للموقع فأنت توافق على الشروط التالية:\n- المحتوى للأغراض المعلوماتية فقط.\n- قد نقوم بتحديث الشروط من وقت لآخر.\n\nآخر تحديث: 2026-02-08',
    en: '## Terms of Use\n\nBy using the site you agree to:\n- Content is for informational purposes only.\n- We may update these terms periodically.\n\nLast updated: 2026-02-08'
  },
  cookies: {
    ar: '## سياسة الكوكيز\n\nنستخدم ملفات تعريف الارتباط لتحسين التجربة.\n- يمكنك تعطيل الكوكيز من إعدادات المتصفح.\n- قد تتأثر بعض الميزات عند التعطيل.',
    en: '## Cookie Policy\n\nWe use cookies to improve your experience.\n- You can disable cookies in your browser.\n- Some features may not work properly if disabled.'
  },
  faq: {
    ar: '## الأسئلة الشائعة\n\n### كيف يتم اختيار الأماكن؟\nنختار الأماكن بعد تجارب حقيقية ومراجعات واضحة.\n\n### كيف أتواصل معكم؟\nعبر صفحة التواصل أو البريد الإلكتروني.',
    en: '## FAQ\n\n### How do you select places?\nWe select based on real visits and clear reviews.\n\n### How can I contact you?\nUse the Contact page or email.'
  }
});

const PagesSettingsPage: React.FC = () => {
  const [pages, setPages] = useState<PagesConfig>(() => defaultPages());
  const [meta, setMeta] = useState<PagesMeta>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        setPages({ ...defaultPages(), ...(data?.pages_json || {}) });
        setMeta(data?.pages_meta_json || {});
      })
      .catch(() => setPages(defaultPages()));
  }, []);

  const updateLocalized = (target: Localized | undefined, lang: 'ar' | 'en', next: string) => ({
    ...(target || {}),
    [lang]: next
  });

  const onSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ pages_json: pages, pages_meta_json: meta });
      setMessage('Saved');
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setSaving(false);
    }
  };

  const pageBlocks = useMemo(
    () => [
      { key: 'privacy', title: 'Privacy Policy' },
      { key: 'contact', title: 'Contact Us' },
      { key: 'advertise', title: 'Advertise' },
      { key: 'terms', title: 'Terms of Use' },
      { key: 'cookies', title: 'Cookie Policy' },
      { key: 'faq', title: 'FAQ' }
    ],
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Static Pages</h1>
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

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300">
        Supports basic Markdown: headings (#), lists (-), **bold**, _italic_, and links.
      </div>

      <label className="flex items-center gap-2 text-xs text-gray-300">
        <input type="checkbox" checked={showPreview} onChange={() => setShowPreview((prev) => !prev)} />
        Show live preview
      </label>

      {pageBlocks.map((block) => {
        const key = block.key as keyof PagesConfig;
        const metaKey = block.key as keyof PagesMeta;
        return (
          <section key={block.key} className="space-y-3">
            <div className="text-sm font-semibold">{block.title}</div>
            <input
              className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
              placeholder="OG Image URL (optional)"
              value={meta?.[metaKey]?.ogImage || ''}
              onChange={(e) =>
                setMeta((prev) => ({
                  ...prev,
                  [metaKey]: { ...(prev?.[metaKey] || {}), ogImage: e.target.value }
                }))
              }
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <textarea
                  className="min-h-[240px] bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm"
                  placeholder={`${block.title} (AR)`}
                  value={pages[key]?.ar || ''}
                  onChange={(e) =>
                    setPages((prev) => ({ ...prev, [key]: updateLocalized(prev[key], 'ar', e.target.value) }))
                  }
                />
                {showPreview && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Markdown content={pages[key]?.ar || ''} />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <textarea
                  className="min-h-[240px] bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm"
                  placeholder={`${block.title} (EN)`}
                  value={pages[key]?.en || ''}
                  onChange={(e) =>
                    setPages((prev) => ({ ...prev, [key]: updateLocalized(prev[key], 'en', e.target.value) }))
                  }
                />
                {showPreview && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Markdown content={pages[key]?.en || ''} />
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default PagesSettingsPage;
