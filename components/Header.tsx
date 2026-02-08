import React, { useEffect, useState } from 'react';
import { Globe, Compass } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useLang } from '../hooks/useLang';
import { t } from '../utils/i18n';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { lang, otherLang, switchPath } = useLang();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY;
      if (goingDown && y > 80) {
        setHidden(true);
      } else if (!goingDown) {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full border-b border-gray-200/60 dark:border-white/10',
        'bg-white/85 dark:bg-[#0f172a]/85 backdrop-blur shadow-sm transition-all duration-300',
        hidden ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        {/* Logo Area */}
        <Link to={`/${lang}`} className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Compass className="text-white w-6 h-6" />
          </div>
          <div className="text-gray-900 dark:text-white">
            <h1 className="text-xl font-black leading-none">دليل بشكتاش</h1>
            <span className="text-[10px] tracking-widest opacity-70 uppercase">Besiktas City Guide</span>
          </div>
        </Link>

        {/* Navigation - Hidden on mobile for simplicity, visible on md+ */}
        <nav className="hidden md:flex items-center gap-3 text-gray-600 dark:text-gray-200 text-sm font-semibold">
          {[
            { to: `/${lang}`, label: t(lang, 'home') },
            { to: `/${lang}/blog`, label: t(lang, 'blog') },
            { to: `/${lang}/category/breakfast`, label: t(lang, 'categories') },
            { to: `/${lang}/compare/istanbul-vs-besiktas`, label: t(lang, 'compare') },
            { to: `/${lang}/about`, label: t(lang, 'about') }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${lang}`}
              className={({ isActive }) =>
                [
                  'group relative px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary hover:-translate-y-0.5',
                  isActive ? 'text-primary bg-gray-100/80 dark:bg-white/10' : ''
                ].join(' ')
              }
            >
              <span className="relative z-10">{item.label}</span>
              <span className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle compact />
          <Link to={switchPath} className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs hover:bg-gray-100 transition dark:border-white/20 dark:text-white dark:hover:bg-white/10">
            <Globe className="w-3 h-3" />
            <span>{otherLang.toUpperCase()}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
