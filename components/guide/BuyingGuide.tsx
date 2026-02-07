import React from 'react';

interface BuyingGuideProps {
  heading: string;
  bullets: string[];
  note?: string;
}

const BuyingGuide: React.FC<BuyingGuideProps> = ({ heading, bullets, note }) => {
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-[#E5E7EB] p-6">
      <h3 className="text-xl font-black text-[#111827] mb-4">{heading}</h3>
      <ul className="space-y-3 text-sm text-gray-600">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#22C55E]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {note && <div className="mt-4 text-xs text-gray-500">{note}</div>}
    </section>
  );
};

export default BuyingGuide;
