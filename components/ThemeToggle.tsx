import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === 'light' ? 'dark' : 'light';
  const label = theme === 'dark' ? 'Dark' : 'Light';
  const icon = theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className={[
        'flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition',
        'border-gray-200 text-gray-700 hover:bg-gray-100',
        'dark:border-white/20 dark:text-white dark:hover:bg-white/10',
        compact ? 'px-2' : ''
      ].join(' ')}
      title={`Theme: ${label}`}
    >
      {icon}
      {!compact && <span>{label}</span>}
    </button>
  );
};

export default ThemeToggle;
