import React from 'react';
import type { GuideItem } from '../../types/guide';

interface GuideItemSectionProps {
  item: GuideItem;
  ctaLabel: string;
  highlight?: boolean;
  onPrimary: (item: GuideItem) => void;
  onMaps: (item: GuideItem) => void;
  labels: {
    pros: string;
    cons: string;
    address: string;
    area: string;
    phone: string;
    hours: string;
    externalRating: string;
    maps: string;
  };
}

const GuideItemSection: React.FC<GuideItemSectionProps> = ({
  item,
  ctaLabel,
  highlight,
  onPrimary,
  onMaps,
  labels
}) => {
  return (
    <section
      id={item.id}
      className={`rounded-3xl bg-white shadow-sm border border-[#E5E7EB] p-6 md:p-8 transition ${
        highlight ? 'ring-2 ring-[#22C55E] shadow-lg' : ''
      }`}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="w-full h-56 object-cover" />
            <span className="absolute top-3 end-3 rounded-full bg-[#22C55E] px-3 py-1 text-xs font-bold text-[#0f172a]">
              #{item.rank}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.highlights?.map((h) => (
              <div key={h.label} className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs text-gray-700">
                {h.label}: <span className="font-bold">{h.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-2/3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-[#111827]">{item.name}</h3>
              <div className="text-xs text-gray-500 mt-1">{item.bestFor}</div>
            </div>
            <div className="rounded-2xl bg-[#DCFCE7] px-4 py-2 text-center">
              <div className="text-lg font-black text-[#166534]">{item.score.value.toFixed(1)}</div>
              <div className="text-xs text-[#166534]">{item.score.label}</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">{item.whyChosen}</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs font-bold text-[#22C55E] mb-2">{labels.pros}</div>
              <ul className="space-y-2 text-gray-600">
                {item.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#22C55E]" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 mb-2">{labels.cons}</div>
              <ul className="space-y-2 text-gray-600">
                {item.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gray-300" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-4 text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {item.localInfo.address && <div>{labels.address}: {item.localInfo.address}</div>}
              {item.localInfo.area && <div>{labels.area}: {item.localInfo.area}</div>}
              {item.localInfo.phone && <div>{labels.phone}: {item.localInfo.phone}</div>}
              {item.localInfo.hours && <div>{labels.hours}: {item.localInfo.hours}</div>}
              {item.localInfo.googleRatingText && (
                <div>{labels.externalRating}: {item.localInfo.googleRatingText}</div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onPrimary(item)}
              className="rounded-full bg-[#22C55E] px-5 py-2 text-xs font-bold text-[#0f172a] hover:bg-[#16a34a] transition"
            >
              {ctaLabel}
            </button>
            {item.links.maps && (
              <button
                onClick={() => onMaps(item)}
                className="rounded-full border border-[#E5E7EB] px-5 py-2 text-xs font-bold text-gray-700 hover:border-[#22C55E] transition"
              >
                {labels.maps}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideItemSection;
