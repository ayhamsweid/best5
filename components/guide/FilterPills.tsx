import React from 'react';

interface FilterPillsProps {
  pills: Array<{ key: string; label: string }>;
  activeKey: string;
  onChange: (key: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ pills, activeKey, onChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {pills.map((pill) => {
        const active = pill.key === activeKey;
        return (
          <button
            key={pill.key}
            onClick={() => onChange(pill.key)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              active
                ? 'bg-[#22C55E] text-[#0f172a] border-[#22C55E]'
                : 'bg-white/10 text-white border-white/20 hover:border-[#22C55E]'
            }`}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterPills;
