import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { GuideCard } from '../types';
import { Link } from 'react-router-dom';
import { useLang } from '../hooks/useLang';

const FeaturedGuides: React.FC = () => {
  const { lang } = useLang();
  const guides: GuideCard[] =
    lang === 'ar'
      ? [
          {
            id: 1,
            title: 'أفضل 5 مطاعم برغر في بشكتاش',
            description: 'دليلك الشامل لأقوى تجارب البرغر، من خبز البريوش الفاخر إلى الصلصات السرية.',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
            tag: 'موصى به',
            tagColor: 'bg-primary',
            slug: 'best-burgers'
          },
          {
            id: 2,
            title: 'أفضل أماكن الفطور بإطلالة بحرية',
            description: 'استمتع بوجبة الفطور التركية التقليدية أمام مضيق البوسفور مباشرة في أفضل المواقع.',
            image: 'https://images.unsplash.com/photo-1629117606775-6e04d498184f?q=80&w=1000&auto=format&fit=crop',
            tag: 'إطلالة بحرية',
            tagColor: 'bg-teal-600',
            slug: 'breakfast-sea-view'
          },
          {
            id: 3,
            title: 'دليل القهوة المختصة في بشكتاش',
            description: 'لعشاق المذاق الرفيع، اخترنا لكم أفضل المحامص والمقاهي التي تقدم قهوة بمعايير عالمية.',
            image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop',
            tag: 'قهوة مختصة',
            tagColor: 'bg-amber-600',
            slug: 'specialty-coffee'
          }
        ]
      : [
          {
            id: 1,
            title: 'Top 5 Burger Spots in Beşiktaş',
            description: 'A complete guide to the best burgers—from brioche buns to signature sauces.',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
            tag: 'Recommended',
            tagColor: 'bg-primary',
            slug: 'best-burgers'
          },
          {
            id: 2,
            title: 'Best Breakfasts with Sea Views',
            description: 'Enjoy a classic Turkish breakfast with Bosphorus views at the top spots.',
            image: 'https://images.unsplash.com/photo-1629117606775-6e04d498184f?q=80&w=1000&auto=format&fit=crop',
            tag: 'Sea View',
            tagColor: 'bg-teal-600',
            slug: 'breakfast-sea-view'
          },
          {
            id: 3,
            title: 'Specialty Coffee Guide in Beşiktaş',
            description: 'For coffee lovers, we curated the best roasters and cafes with world-class brews.',
            image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop',
            tag: 'Specialty Coffee',
            tagColor: 'bg-amber-600',
            slug: 'specialty-coffee'
          }
        ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      <div className="flex justify-between items-end mb-10 border-r-4 border-primary pr-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            {lang === 'ar' ? 'أحدث أدلة المقارنة' : 'Latest comparison guides'}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">
            {lang === 'ar' ? 'أدلة مفصلة تم إعدادها بواسطة خبراء محليين' : 'Detailed guides curated by local experts'}
          </p>
        </div>
        <Link to={`/${lang}/compare/all`} className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline">
          {lang === 'ar' ? 'عرض الكل' : 'View all'} <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <div key={guide.id} className="group bg-white dark:bg-[#111827] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-white/10 flex flex-col h-full">
            <div className="relative h-60 overflow-hidden">
              <img 
                src={guide.image} 
                alt={guide.title} 
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <span className={`absolute top-4 right-4 ${guide.tagColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                {guide.tag}
              </span>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                {guide.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                {guide.description}
              </p>
              
              <Link to={`/${lang}/compare/${guide.slug}`} className="w-full bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-md">
                {lang === 'ar' ? 'عرض المقارنة' : 'Open comparison'}
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <Link to={`/${lang}/compare/all`} className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
          {lang === 'ar' ? 'عرض الكل' : 'View all'} <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedGuides;
