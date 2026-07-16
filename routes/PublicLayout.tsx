import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLang } from '../hooks/useLang';
import { fetchPublicSettings, trackPageView } from '../services/api';
import Ga4Loader from '../components/Ga4Loader';
import ContentLoading from '../components/ContentLoading';
import { useRouteTransition } from '../context/RouteTransitionContext';
import { useInitialData } from '../context/InitialDataContext';
import { LanguageSwitchProvider } from '../context/LanguageSwitchContext';

const PublicLayout: React.FC = () => {
  const { lang } = useLang();
  const { isPending } = useRouteTransition();
  const location = useLocation();
  const { settings } = useInitialData();
  const [ga4, setGa4] = useState<string | null>(() => settings?.ga4_measurement_id || null);
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  useEffect(() => {
    fetchPublicSettings()
      .then((settings) => setGa4(settings?.ga4_measurement_id || null))
      .catch(() => setGa4(null));
  }, []);

  useEffect(() => {
    trackPageView({ path: location.pathname + location.search, lang }).catch(() => null);
  }, [location.pathname, location.search, lang]);
  return (
    <LanguageSwitchProvider>
      <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
        <Ga4Loader measurementId={ga4} />
        <Header />
        <main className="flex-grow relative">
          <Suspense fallback={<ContentLoading />}>
            <Outlet />
          </Suspense>
          {isPending && (
            <div className="pointer-events-none absolute inset-0 z-10 bg-gray-50/95">
              <ContentLoading />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </LanguageSwitchProvider>
  );
};

export default PublicLayout;
