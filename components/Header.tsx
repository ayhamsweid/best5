import React from 'react';
import { Globe, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../hooks/useLang';
import { t } from '../utils/i18n';

const Header: React.FC = () => {
  const { lang, otherLang, switchPath } = useLang();
  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Area */}
        <Link to={`/${lang}`} className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Compass className="text-white w-6 h-6" />
          </div>
          <div className="text-white">
            <h1 className="text-xl font-black leading-none">دليل بشكتاش</h1>
            <span className="text-[10px] tracking-widest opacity-80 uppercase">Besiktas City Guide</span>
          </div>
        </Link>

        {/* Navigation - Hidden on mobile for simplicity, visible on md+ */}
        <nav className="hidden md:flex items-center gap-8 text-gray-200 text-sm font-medium">
          <Link to={`/${lang}`} className="hover:text-primary transition-colors">{t(lang, 'home')}</Link>
          <Link to={`/${lang}/blog`} className="hover:text-primary transition-colors">{t(lang, 'blog')}</Link>
          <Link to={`/${lang}/category/breakfast`} className="hover:text-primary transition-colors">{t(lang, 'categories')}</Link>
          <Link to={`/${lang}/compare/istanbul-vs-besiktas`} className="hover:text-primary transition-colors">{t(lang, 'compare')}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to={switchPath} className="flex items-center gap-2 text-white border border-white/20 px-4 py-2 rounded-full text-xs hover:bg-white/10 transition">
            <Globe className="w-3 h-3" />
            <span>{otherLang.toUpperCase()}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
