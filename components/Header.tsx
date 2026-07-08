import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Compass, Globe, Menu, Search, TrendingUp, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLang } from '../hooks/useLang';
import { fetchPublicSettings } from '../services/api';
import SearchSuggestions from './SearchSuggestions';
import { useInitialData } from '../context/InitialDataContext';

type Localized = { ar?: string; en?: string };
type HeaderConfig = {
  logoTitle?: Localized;
  logoSubtitle?: Localized;
  logoImageUrl?: string;
  showLangSwitch?: boolean;
};

const Header: React.FC = () => {
  const { lang, otherLang, switchPath } = useLang();
  const navigate = useNavigate();
  const isArabic = lang === 'ar';
  const { settings } = useInitialData();
  const [hidden, setHidden] = useState(false);
  const [config, setConfig] = useState<HeaderConfig | null>(() => settings?.header_json || null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCloseProgress, setMobileCloseProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const mobileOpenScrollY = useRef(0);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (mobileOpen && window.innerWidth < 1024) {
        setHidden(false);
        const closeDistance = 180;
        const distance = Math.abs(window.scrollY - mobileOpenScrollY.current);
        const progress = Math.min(distance / closeDistance, 1);
        setMobileCloseProgress(progress);
        if (progress >= 1) {
          setMobileOpen(false);
          setMobileCloseProgress(0);
          setHidden(window.scrollY > 80);
        }
        lastY = window.scrollY;
        return;
      }

      if (window.innerWidth < 1024) {
        const y = window.scrollY;
        const goingDown = y > lastY;
        setHidden(goingDown && y > 80);
        lastY = window.scrollY;
        return;
      }

      const y = window.scrollY;
      const goingDown = y > lastY;
      setHidden(goingDown && y > 80);
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    mobileOpenScrollY.current = window.scrollY;
    setMobileCloseProgress(0);
  }, [mobileOpen]);

  useEffect(() => {
    fetchPublicSettings()
      .then((data) => setConfig(data?.header_json || null))
      .catch(() => setConfig(null));
  }, []);

  const logoTitle = useMemo(
    () => config?.logoTitle?.[lang] || (isArabic ? 'أفضل 5' : 'Best 5'),
    [config, isArabic, lang]
  );

  const logoSubtitle = useMemo(
    () => config?.logoSubtitle?.[lang] || (isArabic ? 'أفضل 5 اختيارات في كل مجال' : 'Top 5 picks in every field'),
    [config, isArabic, lang]
  );

  const navCopy = {
    home: isArabic ? 'الرئيسية' : 'Home',
    categories: isArabic ? 'الأقسام' : 'Categories',
    cities: isArabic ? 'المدن' : 'Cities',
    mostRead: isArabic ? 'الأكثر قراءة' : 'Most Read',
    articles: isArabic ? 'المقالات' : 'Articles',
    search: isArabic ? 'بحث' : 'Search',
    placeholder: isArabic ? 'ابحث عن أفضل 5...' : 'Search Best 5...'
  };

  const homeSectionPath = (sectionId: string) => `/${lang}#${sectionId}`;

  const submitSearch = (value = query, href?: string) => {
    const clean = value.trim();
    if (!clean) return;
    setSearchOpen(false);
    setMobileOpen(false);
    if (href) {
      navigate(href);
      return;
    }
    navigate(`/${lang}/search?q=${encodeURIComponent(clean)}`);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileCloseProgress(0);
  };

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full border-b border-gray-200/60',
        'bg-white/85 backdrop-blur shadow-sm transition-all duration-300',
        hidden ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        <Link to={`/${lang}`} className="flex items-center gap-3">
          {config?.logoImageUrl ? (
            <img src={config.logoImageUrl} alt={logoTitle} className="block h-12 w-12 shrink-0 rounded-xl object-contain" />
          ) : (
            <Compass className="h-8 w-8 shrink-0 text-primary" />
          )}
          <div className="text-gray-900">
            <div className="text-xl font-black leading-none">{logoTitle}</div>
            <span className="text-[10px] tracking-widest opacity-70 uppercase">{logoSubtitle}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 text-gray-600 text-sm font-black lg:flex">
          <NavLink
            to={`/${lang}`}
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition hover:bg-gray-100 hover:text-primary ${isActive ? 'bg-gray-100 text-primary' : ''}`
            }
          >
            {navCopy.home}
          </NavLink>
          <Link to={homeSectionPath('interests')} className="rounded-full px-4 py-2 transition hover:bg-gray-100 hover:text-primary">
            {navCopy.categories}
          </Link>
          <Link to={homeSectionPath('cities')} className="rounded-full px-4 py-2 transition hover:bg-gray-100 hover:text-primary">
            {navCopy.cities}
          </Link>
          <Link to={homeSectionPath('popular')} className="rounded-full px-4 py-2 transition hover:bg-gray-100 hover:text-primary">
            {navCopy.mostRead}
          </Link>
          <NavLink
            to={`/${lang}/blog`}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition hover:bg-gray-100 hover:text-primary ${isActive ? 'bg-gray-100 text-primary' : ''}`
            }
          >
            {navCopy.articles}
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setSearchOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-100 hover:text-primary"
              aria-label={navCopy.search}
            >
              <Search className="h-4 w-4" />
            </button>
            {searchOpen && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitSearch();
                }}
                className={`absolute top-full mt-3 w-80 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl ${isArabic ? 'left-0' : 'right-0'}`}
              >
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                  className={`h-11 w-full rounded-xl border border-gray-200 bg-[#fbf7f2] px-4 text-sm font-bold outline-none focus:border-primary ${
                    isArabic ? 'text-right' : 'text-left'
                  }`}
                  placeholder={navCopy.placeholder}
                />
                <SearchSuggestions lang={lang} query={query} onPick={submitSearch} />
              </form>
            )}
          </div>

          {config?.showLangSwitch !== false && (
            <Link to={switchPath} className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs hover:bg-gray-100 transition">
              <Globe className="w-3 h-3" />
              <span>{otherLang.toUpperCase()}</span>
            </Link>
          )}

          <button
            onClick={() => {
              setMobileOpen((open) => {
                const nextOpen = !open;
                if (nextOpen) setHidden(false);
                return nextOpen;
              });
              setMobileCloseProgress(0);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-100 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="overflow-hidden border-t border-gray-100 bg-white px-4 shadow-xl transition-[max-height,opacity,transform,padding] duration-200 ease-out lg:hidden"
          dir={isArabic ? 'rtl' : 'ltr'}
          style={{
            maxHeight: `${Math.max(0, 360 * (1 - mobileCloseProgress))}px`,
            opacity: 1 - mobileCloseProgress,
            paddingTop: `${16 * (1 - mobileCloseProgress)}px`,
            paddingBottom: `${16 * (1 - mobileCloseProgress)}px`,
            transform: `translateY(${-10 * mobileCloseProgress}px)`
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
            className="relative mb-4 flex gap-2 rounded-2xl bg-[#fbf7f2] p-2"
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={`min-w-0 flex-1 bg-transparent px-3 text-sm font-bold outline-none ${isArabic ? 'text-right' : 'text-left'}`}
              placeholder={navCopy.placeholder}
            />
            <button className="h-10 shrink-0 rounded-xl bg-primary px-5 text-sm font-black text-white">{navCopy.search}</button>
            <SearchSuggestions lang={lang} query={query} onPick={submitSearch} className="[&>div]:max-h-56" />
          </form>

          <div className="grid gap-2 text-sm font-black text-gray-700">
            <Link onClick={closeMobile} to={`/${lang}`} className="rounded-xl px-3 py-3 hover:bg-gray-100">
              {navCopy.home}
            </Link>
            <Link onClick={closeMobile} to={homeSectionPath('interests')} className="rounded-xl px-3 py-3 hover:bg-gray-100">
              {navCopy.categories}
            </Link>
            <Link onClick={closeMobile} to={homeSectionPath('cities')} className="rounded-xl px-3 py-3 hover:bg-gray-100">
              {navCopy.cities}
            </Link>
            <Link onClick={closeMobile} to={homeSectionPath('popular')} className="rounded-xl px-3 py-3 hover:bg-gray-100">
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {navCopy.mostRead}
              </span>
            </Link>
            <Link onClick={closeMobile} to={`/${lang}/blog`} className="rounded-xl px-3 py-3 hover:bg-gray-100">
              {navCopy.articles}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
