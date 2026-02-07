import React from 'react';
import type { GuideItem } from '../../types/guide';

interface ComparisonTableProps {
  items: GuideItem[];
  ctaLabel: string;
  onCta: (item: GuideItem) => void;
  labels: {
    title: string;
    rank: string;
    name: string;
    score: string;
    price: string;
    bestFor: string;
  };
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ items, ctaLabel, onCta, labels }) => {
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-[#E5E7EB] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E7EB]">
        <h3 className="text-lg font-black text-[#111827]">{labels.title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFB] text-[#6B7280] text-xs">
            <tr>
              <th className="px-4 py-3 text-start">{labels.rank}</th>
              <th className="px-4 py-3 text-start">{labels.name}</th>
              <th className="px-4 py-3 text-start">{labels.score}</th>
              <th className="px-4 py-3 text-start">{labels.price}</th>
              <th className="px-4 py-3 text-start">{labels.bestFor}</th>
              <th className="px-4 py-3 text-start"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-none">
                <td className="px-4 py-4 font-bold text-[#111827]">{item.rank}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {item.logoUrl ? (
                      <img src={item.logoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#E5E7EB]" />
                    )}
                    <div className="font-semibold text-[#111827]">{item.name}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#166534]">
                    {item.score.value.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-600">{item.priceRangeText || '—'}</td>
                <td className="px-4 py-4 text-gray-600">{item.bestFor}</td>
                <td className="px-4 py-4">
                  <button
                    className="rounded-full bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#0f172a] hover:bg-[#16a34a] transition"
                    onClick={() => onCta(item)}
                  >
                    {ctaLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComparisonTable;
