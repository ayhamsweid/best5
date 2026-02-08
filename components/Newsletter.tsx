import React from 'react';
import { Mail } from 'lucide-react';
import { useLang } from '../hooks/useLang';

const Newsletter: React.FC = () => {
  const { lang } = useLang();
  const copy = {
    heading: lang === 'ar' ? 'لا تفوت أي جديد في بشكتاش' : 'Don’t miss what’s new in Beşiktaş',
    desc:
      lang === 'ar'
        ? 'اشترك في نشرتنا الإخبارية لتصلك أحدث الأدلة والعروض الحصرية أسبوعياً.'
        : 'Subscribe to receive the latest guides and exclusive offers each week.',
    placeholder: lang === 'ar' ? 'بريدك الإلكتروني' : 'Your email',
    cta: lang === 'ar' ? 'اشترك الآن' : 'Subscribe'
  };
  return (
    <section className="py-24 px-4 bg-gray-50 dark:bg-[#0b1224]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#e6fcf0] dark:bg-[#0f172a] border border-primary/10 dark:border-white/10 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white dark:bg-white/10 p-4 rounded-2xl shadow-sm mb-6 text-primary">
                    <Mail className="w-8 h-8" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">{copy.heading}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-lg">
                    {copy.desc}
                </p>

                <form className="w-full max-w-lg flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder={copy.placeholder}
                        className="flex-grow py-4 px-6 rounded-xl border-none focus:ring-2 focus:ring-primary shadow-sm text-gray-800 dark:text-white dark:bg-white/5"
                    />
                    <button type="submit" className="bg-primary hover:bg-green-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-green-500/30 transition-all">
                        {copy.cta}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
