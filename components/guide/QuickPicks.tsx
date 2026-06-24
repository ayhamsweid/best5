import React from 'react';

interface QuickPicksProps {
  picks: Array<{ label: string; title: string; note?: string; itemId: string }>;
  onPick: (itemId: string) => void;
}

const QuickPicks: React.FC<QuickPicksProps> = ({ picks, onPick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {picks.map((pick) => (
        <button
          key={pick.itemId}
          onClick={() => onPick(pick.itemId)}
          className="text-start rounded-2xl bg-white shadow-sm border border-[#E5E7EB] p-5 hover:shadow-md transition"
        >
          <div className="text-xs text-[#22C55E] font-bold mb-2">{pick.label}</div>
          <div className="font-black text-lg text-[#111827]">{pick.title}</div>
          {pick.note && <div className="text-xs text-gray-500 mt-2">{pick.note}</div>}
        </button>
      ))}
    </div>
  );
};

export default QuickPicks;
