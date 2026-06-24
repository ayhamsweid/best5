import React, { useState } from 'react';

interface FAQAccordionProps {
  items: Array<{ q: string; a: string }>;
  heading: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ items, heading }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-[#E5E7EB] p-6">
      <h3 className="text-xl font-black text-[#111827] mb-4">{heading}</h3>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const open = openIndex === idx;
          return (
            <button
              key={item.q}
              className="w-full text-start rounded-xl border border-[#E5E7EB] px-4 py-3 hover:border-[#22C55E] transition"
              onClick={() => setOpenIndex(open ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="font-bold text-[#111827] text-sm">{item.q}</div>
                <span className="text-xs text-gray-500">{open ? '−' : '+'}</span>
              </div>
              {open && <div className="mt-3 text-xs text-gray-600 leading-relaxed">{item.a}</div>}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default FAQAccordion;
