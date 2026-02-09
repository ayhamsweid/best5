import React, { useMemo, useState } from 'react';

const SearchConsolePage: React.FC = () => {
  const base = typeof window !== 'undefined' ? window.location.origin.replace(':3000', '') : '';
  const sitemap = `${base}/sitemap.xml`;
  const robots = `${base}/robots.txt`;
  const [googleChecked, setGoogleChecked] = useState(() => localStorage.getItem('gsc_verified') === '1');
  const [bingChecked, setBingChecked] = useState(() => localStorage.getItem('bing_verified') === '1');

  const mark = (key: string, value: boolean) => {
    localStorage.setItem(key, value ? '1' : '0');
  };

  const steps = useMemo(
    () => [
      { label: 'Add site to Google Search Console', href: 'https://search.google.com/search-console' },
      { label: 'Submit sitemap.xml', href: 'https://search.google.com/search-console' },
      { label: 'Add site to Bing Webmaster Tools', href: 'https://www.bing.com/webmasters' },
      { label: 'Submit sitemap.xml in Bing', href: 'https://www.bing.com/webmasters' }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Search Console</h1>
        <p className="text-xs text-gray-300 mt-1">Connect your site to Google and Bing to see impressions, clicks, and indexing.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-sm">
        <div>Sitemap: <span className="text-primary">{sitemap}</span></div>
        <div>Robots: <span className="text-primary">{robots}</span></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="text-sm font-semibold">Google Search Console</div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={googleChecked}
              onChange={(e) => {
                setGoogleChecked(e.target.checked);
                mark('gsc_verified', e.target.checked);
              }}
            />
            Verified (manual)
          </label>
          <a className="text-xs text-primary underline" href="https://search.google.com/search-console" target="_blank" rel="noreferrer">
            Open GSC
          </a>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="text-sm font-semibold">Bing Webmaster Tools</div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={bingChecked}
              onChange={(e) => {
                setBingChecked(e.target.checked);
                mark('bing_verified', e.target.checked);
              }}
            />
            Verified (manual)
          </label>
          <a className="text-xs text-primary underline" href="https://www.bing.com/webmasters" target="_blank" rel="noreferrer">
            Open Bing
          </a>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="text-sm font-semibold mb-3">Checklist</div>
        <ul className="space-y-2 text-xs text-gray-300">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center justify-between">
              <span>{step.label}</span>
              <a href={step.href} target="_blank" rel="noreferrer" className="underline text-primary">
                Open
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchConsolePage;
