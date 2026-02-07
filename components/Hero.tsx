import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../hooks/useLang';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const [query, setQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/${lang}/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative h-[650px] flex flex-col justify-center items-center text-center px-4 overflow-visible">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop" 
          alt="Istanbul Besiktas" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70"></div>
        {/* Map overlay texture effect */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/city-fields.png')]"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto mt-16">
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
          دليلك الشامل لتجارب استثنائية<br />
          <span className="text-gray-300">في قلب اسطنبول</span>
        </h1>
        <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
          نحن نقوم بالبحث والمقارنة لنقدم لك الأفضل دائماً، دون الحاجة للتنقل بين مئات الصفحات
        </p>

        {/* Search Box */}
        <div className="relative max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ماذا تريد أن تستكشف اليوم؟" 
              className="w-full py-4 pr-6 pl-32 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-2xl text-lg"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <button 
              type="submit"
              className="absolute left-2 top-2 bottom-2 bg-primary hover:bg-green-600 text-white font-bold py-2 px-8 rounded-md transition-colors flex items-center gap-2"
            >
              بحث
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
