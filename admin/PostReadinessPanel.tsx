import React from 'react';
import { formatSeoTitle } from '../server/src/common/seo-title';
import { getPostReadiness } from '../server/src/common/post-readiness';

const PostReadinessPanel: React.FC<{ values: Record<string, any> }> = ({ values }) => {
  const readiness = getPostReadiness(values);
  const rows = [
    ['AR', values.seo_title_ar || values.title_ar || '', values.seo_desc_ar || values.excerpt_ar || '', readiness.stats.seoTitleAr, readiness.stats.seoDescriptionAr],
    ['EN', values.seo_title_en || values.title_en || '', values.seo_desc_en || values.excerpt_en || '', readiness.stats.seoTitleEn, readiness.stats.seoDescriptionEn]
  ] as const;

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-[#111827] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black">Publish readiness</div>
          <div className="text-xs text-gray-500">{readiness.errors.length ? `${readiness.errors.length} blocking issue(s)` : 'Ready to publish'} · {readiness.warnings.length} warning(s)</div>
        </div>
        <div className="text-xs font-semibold text-gray-600">Internal links: {readiness.stats.internalLinks}</div>
      </div>

      {(readiness.errors.length > 0 || readiness.warnings.length > 0) && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs font-bold text-red-700">Errors</div>
            {readiness.errors.length ? (
              <ul className="mt-1 list-disc space-y-1 ps-5 text-xs text-red-700">
                {readiness.errors.map((error) => <li key={error}>{error}</li>)}
              </ul>
            ) : <div className="mt-1 text-xs text-emerald-700">No blocking errors.</div>}
          </div>
          <div>
            <div className="text-xs font-bold text-amber-700">Warnings</div>
            {readiness.warnings.length ? (
              <ul className="mt-1 list-disc space-y-1 ps-5 text-xs text-amber-700">
                {readiness.warnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            ) : <div className="mt-1 text-xs text-emerald-700">No warnings.</div>}
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {rows.map(([lang, rawTitle, description, titleLength, descriptionLength]) => (
          <div key={lang} className="rounded-xl border border-gray-200 p-3">
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>{lang} search preview</span>
              <span>Title {titleLength}/60 · Meta {descriptionLength}/160</span>
            </div>
            <div className="mt-2 truncate text-sm font-semibold text-blue-700">{formatSeoTitle(rawTitle)}</div>
            <div className="text-xs text-emerald-700">best5.com.tr/{lang.toLowerCase()}/blog/…</div>
            <p className="mt-1 line-clamp-2 text-xs text-gray-600">{description || 'Meta description preview'}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostReadinessPanel;
