import React, { useEffect, useMemo, useState } from 'react';
import { fetchSettings, updateSettings } from '../services/api';

type Localized = { ar?: string; en?: string };

type NavLinkItem = {
  label?: Localized;
  path?: string;
  external?: boolean;
  enabled?: boolean;
};

type SocialLink = {
  label?: string;
  url?: string;
  icon?: string;
};

type HeaderConfig = {
  logoTitle?: Localized;
  logoSubtitle?: Localized;
  logoImageUrl?: string;
  navLinks?: NavLinkItem[];
  showThemeToggle?: boolean;
  showLangSwitch?: boolean;
};

type FooterConfig = {
  brandTitle?: Localized;
  about?: Localized;
  quickLinks?: NavLinkItem[];
  socials?: SocialLink[];
  address?: Localized;
  email?: string;
  copyright?: Localized;
  credit?: Localized;
  showLatestPosts?: boolean;
};

type SettingsShape = {
  header_json?: HeaderConfig;
  footer_json?: FooterConfig;
};

const defaultHeader = (): HeaderConfig => ({
  logoTitle: { ar: 'دليل بشكتاش', en: 'Besiktas City Guide' },
  logoSubtitle: { ar: 'دليل المدينة', en: 'City Guide' },
  logoImageUrl: '',
  navLinks: [
    { label: { ar: 'الرئيسية', en: 'Home' }, path: '/', external: false, enabled: true },
    { label: { ar: 'المدونة', en: 'Blog' }, path: '/blog', external: false, enabled: true },
    { label: { ar: 'التصنيفات', en: 'Categories' }, path: '/category/breakfast', external: false, enabled: true },
    { label: { ar: 'المقارنات', en: 'Compare' }, path: '/compare/all', external: false, enabled: true },
    { label: { ar: 'من نحن', en: 'About' }, path: '/about', external: false, enabled: true }
  ],
  showThemeToggle: true,
  showLangSwitch: true
});

const defaultFooter = (): FooterConfig => ({
  brandTitle: { ar: 'دليل بشكتاش', en: 'Besiktas City Guide' },
  about: {
    ar: 'المنصة الموثوقة الأولى لاستكشاف معالم ومطاعم منطقة بشكتاش في اسطنبول.',
    en: 'The trusted platform to explore Beşiktaş landmarks and restaurants.'
  },
  quickLinks: [
    { label: { ar: 'من نحن', en: 'About us' }, path: '/about', external: false, enabled: true },
    { label: { ar: 'سياسة الخصوصية', en: 'Privacy policy' }, path: '/privacy', external: false, enabled: true },
    { label: { ar: 'تواصل معنا', en: 'Contact' }, path: '/contact', external: false, enabled: true },
    { label: { ar: 'أعلن معنا', en: 'Advertise' }, path: '/advertise', external: false, enabled: true }
  ],
  socials: [
    { label: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    { label: 'TikTok', url: 'https://tiktok.com', icon: 'tiktok' }
  ],
  address: { ar: 'سنان باشا، بشكتاش، اسطنبول، تركيا', en: 'Sinan Pasha, Beşiktaş, Istanbul, Turkey' },
  email: 'hello@besiktasguide.com',
  copyright: { ar: '© 2026 دليل بشكتاش. جميع الحقوق محفوظة.', en: '© 2026 Besiktas City Guide. All rights reserved.' },
  credit: { ar: 'تصميم وتطوير بواسطة فريق بشكتاش', en: 'Designed and built by the Beşiktaş team' },
  showLatestPosts: true
});

const HeaderFooterSettingsPage: React.FC = () => {
  const [header, setHeader] = useState<HeaderConfig>(() => defaultHeader());
  const [footer, setFooter] = useState<FooterConfig>(() => defaultFooter());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings()
      .then((data: SettingsShape) => {
        setHeader({ ...defaultHeader(), ...(data?.header_json || {}) });
        setFooter({ ...defaultFooter(), ...(data?.footer_json || {}) });
      })
      .catch(() => {
        setHeader(defaultHeader());
        setFooter(defaultFooter());
      });
  }, []);

  const updateLocalized = (target: Localized | undefined, lang: 'ar' | 'en', next: string) => ({
    ...(target || {}),
    [lang]: next
  });

  const onSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ header_json: header, footer_json: footer });
      setMessage('Saved');
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setSaving(false);
    }
  };

  const quickLinkTemplate = useMemo<NavLinkItem>(
    () => ({ label: { ar: '', en: '' }, path: '', external: false, enabled: true }),
    []
  );

  const navTemplate = useMemo<NavLinkItem>(
    () => ({ label: { ar: '', en: '' }, path: '', external: false, enabled: true }),
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Header & Footer</h1>
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
        <div className="text-sm font-semibold">Header</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Logo Title (AR)"
            value={header.logoTitle?.ar || ''}
            onChange={(e) => setHeader((prev) => ({ ...prev, logoTitle: updateLocalized(prev.logoTitle, 'ar', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Logo Title (EN)"
            value={header.logoTitle?.en || ''}
            onChange={(e) => setHeader((prev) => ({ ...prev, logoTitle: updateLocalized(prev.logoTitle, 'en', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Logo Subtitle (AR)"
            value={header.logoSubtitle?.ar || ''}
            onChange={(e) => setHeader((prev) => ({ ...prev, logoSubtitle: updateLocalized(prev.logoSubtitle, 'ar', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Logo Subtitle (EN)"
            value={header.logoSubtitle?.en || ''}
            onChange={(e) => setHeader((prev) => ({ ...prev, logoSubtitle: updateLocalized(prev.logoSubtitle, 'en', e.target.value) }))}
          />
          <input
            className="md:col-span-2 bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Logo Image URL (optional)"
            value={header.logoImageUrl || ''}
            onChange={(e) => setHeader((prev) => ({ ...prev, logoImageUrl: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={!!header.showThemeToggle}
              onChange={() => setHeader((prev) => ({ ...prev, showThemeToggle: !prev.showThemeToggle }))}
            />
            Show theme toggle
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={!!header.showLangSwitch}
              onChange={() => setHeader((prev) => ({ ...prev, showLangSwitch: !prev.showLangSwitch }))}
            />
            Show language switch
          </label>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-gray-300">Navigation Links</div>
          {(header.navLinks || []).map((item, idx) => (
            <div key={`nav-${idx}`} className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Label (AR)"
                value={item.label?.ar || ''}
                onChange={(e) => {
                  const next = [...(header.navLinks || [])];
                  next[idx] = { ...item, label: updateLocalized(item.label, 'ar', e.target.value) };
                  setHeader((prev) => ({ ...prev, navLinks: next }));
                }}
              />
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Label (EN)"
                value={item.label?.en || ''}
                onChange={(e) => {
                  const next = [...(header.navLinks || [])];
                  next[idx] = { ...item, label: updateLocalized(item.label, 'en', e.target.value) };
                  setHeader((prev) => ({ ...prev, navLinks: next }));
                }}
              />
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Path (e.g. /blog)"
                value={item.path || ''}
                onChange={(e) => {
                  const next = [...(header.navLinks || [])];
                  next[idx] = { ...item, path: e.target.value };
                  setHeader((prev) => ({ ...prev, navLinks: next }));
                }}
              />
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={item.external || false}
                  onChange={() => {
                    const next = [...(header.navLinks || [])];
                    next[idx] = { ...item, external: !item.external };
                    setHeader((prev) => ({ ...prev, navLinks: next }));
                  }}
                />
                External
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={item.enabled !== false}
                    onChange={() => {
                      const next = [...(header.navLinks || [])];
                      next[idx] = { ...item, enabled: !item.enabled };
                      setHeader((prev) => ({ ...prev, navLinks: next }));
                    }}
                  />
                  Enabled
                </label>
                <button
                  className="text-xs text-red-300"
                  onClick={() => {
                    const next = (header.navLinks || []).filter((_, i) => i !== idx);
                    setHeader((prev) => ({ ...prev, navLinks: next }));
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="text-xs text-[#22C55E]"
            onClick={() => setHeader((prev) => ({ ...prev, navLinks: [...(prev.navLinks || []), navTemplate] }))}
          >
            + Add nav link
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm font-semibold">Footer</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Brand Title (AR)"
            value={footer.brandTitle?.ar || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, brandTitle: updateLocalized(prev.brandTitle, 'ar', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Brand Title (EN)"
            value={footer.brandTitle?.en || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, brandTitle: updateLocalized(prev.brandTitle, 'en', e.target.value) }))}
          />
          <textarea
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm min-h-[90px]"
            placeholder="About (AR)"
            value={footer.about?.ar || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, about: updateLocalized(prev.about, 'ar', e.target.value) }))}
          />
          <textarea
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm min-h-[90px]"
            placeholder="About (EN)"
            value={footer.about?.en || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, about: updateLocalized(prev.about, 'en', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Address (AR)"
            value={footer.address?.ar || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, address: updateLocalized(prev.address, 'ar', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Address (EN)"
            value={footer.address?.en || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, address: updateLocalized(prev.address, 'en', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Contact Email"
            value={footer.email || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, email: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={footer.showLatestPosts !== false}
              onChange={() => setFooter((prev) => ({ ...prev, showLatestPosts: !prev.showLatestPosts }))}
            />
            Show latest posts in footer
          </label>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-gray-300">Quick Links</div>
          {(footer.quickLinks || []).map((item, idx) => (
            <div key={`quick-${idx}`} className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Label (AR)"
                value={item.label?.ar || ''}
                onChange={(e) => {
                  const next = [...(footer.quickLinks || [])];
                  next[idx] = { ...item, label: updateLocalized(item.label, 'ar', e.target.value) };
                  setFooter((prev) => ({ ...prev, quickLinks: next }));
                }}
              />
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Label (EN)"
                value={item.label?.en || ''}
                onChange={(e) => {
                  const next = [...(footer.quickLinks || [])];
                  next[idx] = { ...item, label: updateLocalized(item.label, 'en', e.target.value) };
                  setFooter((prev) => ({ ...prev, quickLinks: next }));
                }}
              />
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Path"
                value={item.path || ''}
                onChange={(e) => {
                  const next = [...(footer.quickLinks || [])];
                  next[idx] = { ...item, path: e.target.value };
                  setFooter((prev) => ({ ...prev, quickLinks: next }));
                }}
              />
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={item.external || false}
                  onChange={() => {
                    const next = [...(footer.quickLinks || [])];
                    next[idx] = { ...item, external: !item.external };
                    setFooter((prev) => ({ ...prev, quickLinks: next }));
                  }}
                />
                External
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={item.enabled !== false}
                    onChange={() => {
                      const next = [...(footer.quickLinks || [])];
                      next[idx] = { ...item, enabled: !item.enabled };
                      setFooter((prev) => ({ ...prev, quickLinks: next }));
                    }}
                  />
                  Enabled
                </label>
                <button
                  className="text-xs text-red-300"
                  onClick={() => {
                    const next = (footer.quickLinks || []).filter((_, i) => i !== idx);
                    setFooter((prev) => ({ ...prev, quickLinks: next }));
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="text-xs text-[#22C55E]"
            onClick={() => setFooter((prev) => ({ ...prev, quickLinks: [...(prev.quickLinks || []), quickLinkTemplate] }))}
          >
            + Add quick link
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-gray-300">Social Links</div>
          {(footer.socials || []).map((item, idx) => (
            <div key={`social-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="Label"
                value={item.label || ''}
                onChange={(e) => {
                  const next = [...(footer.socials || [])];
                  next[idx] = { ...item, label: e.target.value };
                  setFooter((prev) => ({ ...prev, socials: next }));
                }}
              />
              <input
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                placeholder="URL"
                value={item.url || ''}
                onChange={(e) => {
                  const next = [...(footer.socials || [])];
                  next[idx] = { ...item, url: e.target.value };
                  setFooter((prev) => ({ ...prev, socials: next }));
                }}
              />
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Icon (instagram, tiktok, x, youtube)"
                  value={item.icon || ''}
                  onChange={(e) => {
                    const next = [...(footer.socials || [])];
                    next[idx] = { ...item, icon: e.target.value };
                    setFooter((prev) => ({ ...prev, socials: next }));
                  }}
                />
                <button
                  className="text-xs text-red-300"
                  onClick={() => {
                    const next = (footer.socials || []).filter((_, i) => i !== idx);
                    setFooter((prev) => ({ ...prev, socials: next }));
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="text-xs text-[#22C55E]"
            onClick={() => setFooter((prev) => ({ ...prev, socials: [...(prev.socials || []), { label: '', url: '', icon: '' }] }))}
          >
            + Add social link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Copyright (AR)"
            value={footer.copyright?.ar || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, copyright: updateLocalized(prev.copyright, 'ar', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Copyright (EN)"
            value={footer.copyright?.en || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, copyright: updateLocalized(prev.copyright, 'en', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Credit (AR)"
            value={footer.credit?.ar || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, credit: updateLocalized(prev.credit, 'ar', e.target.value) }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Credit (EN)"
            value={footer.credit?.en || ''}
            onChange={(e) => setFooter((prev) => ({ ...prev, credit: updateLocalized(prev.credit, 'en', e.target.value) }))}
          />
        </div>
      </section>
    </div>
  );
};

export default HeaderFooterSettingsPage;
