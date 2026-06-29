import React from 'react';
import { safeLinkUrl } from '../utils/contentSecurity';

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderInline = (value: string) =>
  escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (_match, label, url) => {
      const safeUrl = safeLinkUrl(url);
      return safeUrl
        ? `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">${label}</a>`
        : label;
    });

const renderMarkdown = (md: string) => {
  const lines = md.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) {
      closeList();
      return;
    }

    if (line.startsWith('### ')) {
      closeList();
      html.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
      return;
    }
    if (line.startsWith('## ')) {
      closeList();
      html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      return;
    }
    if (line.startsWith('# ')) {
      closeList();
      html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      return;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      const content = renderInline(line.slice(2));
      html.push(`<li>${content}</li>`);
      return;
    }

    closeList();
    const paragraph = renderInline(line);
    html.push(`<p>${paragraph}</p>`);
  });

  closeList();
  return html.join('\n');
};

const Markdown: React.FC<{ content?: string }> = ({ content = '' }) => {
  const html = renderMarkdown(content || '');
  return (
    <div
      className="markdown max-w-none text-gray-600 leading-8
        [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-[#111827] [&_h1]:mt-10 [&_h1]:mb-4
        [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-[#111827] [&_h2]:mt-10 [&_h2]:mb-4
        [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#111827] [&_h3]:mt-8 [&_h3]:mb-3
        [&_p]:mb-5 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:ps-6
        [&_a]:font-bold [&_a]:text-[#b11226] [&_a]:underline [&_a]:underline-offset-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Markdown;
