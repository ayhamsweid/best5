import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLang } from '../hooks/useLang';
import { fetchPublicSettings } from '../services/api';
import Ga4Loader from '../components/Ga4Loader';

const PublicLayout: React.FC = () => {
  const { lang } = useLang();
  const [ga4, setGa4] = useState<string | null>(null);
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  useEffect(() => {
    fetchPublicSettings()
      .then((settings) => setGa4(settings?.ga4_measurement_id || null))
      .catch(() => setGa4(null));
  }, []);
  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
      <Ga4Loader measurementId={ga4} />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
