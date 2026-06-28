import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Seo from '../components/Seo';

const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const lang = location.pathname.startsWith('/en') ? 'en' : 'ar';

  return (
    <>
      <Seo title={lang === 'ar' ? 'الصفحة غير موجودة | Best5' : 'Page not found | Best5'} status={404} />
      <div className="min-h-[65vh] bg-[#F9FAFB] flex items-center justify-center px-6 py-20" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-xl w-full text-center bg-white border border-[#E5E7EB] rounded-3xl p-10 shadow-sm">
        <div className="text-7xl font-black text-[#b11226]">404</div>
        <h1 className="mt-4 text-3xl font-black text-[#111827]">
          {lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}
        </h1>
        <p className="mt-3 text-gray-500">
          {lang === 'ar'
            ? 'الرابط الذي طلبته غير موجود أو تم نقله.'
            : 'The page you requested does not exist or has been moved.'}
        </p>
        <Link className="inline-flex mt-7 rounded-full bg-[#b11226] px-6 py-3 text-sm font-bold text-white" to={`/${lang}`}>
          {lang === 'ar' ? 'العودة إلى الرئيسية' : 'Back to home'}
        </Link>
      </div>
      </div>
    </>
  );
};

export default NotFoundPage;
