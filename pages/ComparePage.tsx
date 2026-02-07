import React from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';

const ComparePage: React.FC = () => {
  const { slug } = useParams();
  const { lang } = useLang();
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <Seo title={`Compare: ${slug}`} canonical={`/${lang}/compare/${slug}`} />
      <h2 className="text-3xl font-black">Comparison: {slug}</h2>
      <p className="text-gray-500 mt-2">Comparison pages are now routable. Hook to `/api/posts?type=compare`.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100">Side A</div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100">Side B</div>
      </div>
    </div>
  );
};

export default ComparePage;
