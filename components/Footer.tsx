import React, { useEffect, useMemo, useState } from 'react';
import { Compass, MapPin, Mail } from 'lucide-react';
import { useLang } from '../hooks/useLang';
import { fetchPublicPosts } from '../services/api';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { lang } = useLang();
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const copy = {
    brand: lang === 'ar' ? 'دليل بشكتاش' : 'Besiktas City Guide',
    about:
      lang === 'ar'
        ? 'المنصة الموثوقة الأولى لاستكشاف معالم ومطاعم منطقة بشكتاش في اسطنبول. نقدم لكم المعلومة بكل شفافية وموضوعية.'
        : 'The trusted platform to explore Beşiktaş landmarks and restaurants. Clear, unbiased info you can rely on.',
    explore: lang === 'ar' ? 'أحدث المدونات' : 'Latest blogs',
    links: lang === 'ar' ? 'روابط سريعة' : 'Quick Links',
    contact: lang === 'ar' ? 'التواصل' : 'Contact',
    exploreLinks: [],
    quickLinks: lang === 'ar'
      ? ['من نحن', 'سياسة الخصوصية', 'تواصل معنا', 'أعلن معنا']
      : ['About us', 'Privacy policy', 'Contact', 'Advertise'],
    address: lang === 'ar' ? 'سنان باشا، بشكتاش، اسطنبول، تركيا' : 'Sinan Pasha, Beşiktaş, Istanbul, Turkey',
    email: 'hello@besiktasguide.com',
    copyright: lang === 'ar' ? '© 2026 دليل بشكتاش. جميع الحقوق محفوظة.' : '© 2026 Besiktas City Guide. All rights reserved.',
    credit: lang === 'ar' ? 'تصميم وتطوير بواسطة فريق بشكتاش' : 'Designed and built by the Beşiktaş team'
  };

  useEffect(() => {
    fetchPublicPosts(lang)
      .then((posts: any[]) => setLatestPosts(posts.slice(0, 4)))
      .catch(() => setLatestPosts([]));
  }, [lang]);

  const latestLinks = useMemo(
    () =>
      latestPosts.map((post) => {
        const slug = (lang === 'ar' ? post.slug_ar : post.slug_en) || post.slug_en || post.slug_ar;
        const title = (lang === 'ar' ? post.title_ar : post.title_en) || post.title_en || post.title_ar;
        return { slug, title };
      }),
    [latestPosts, lang]
  );
  return (
    <footer className="bg-white text-gray-600 pt-20 pb-10 px-4 border-t border-gray-200 dark:bg-secondary dark:text-gray-400 dark:border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary p-1.5 rounded-lg">
              <Compass className="text-white w-5 h-5" />
            </div>
            <div className="text-gray-900 dark:text-white">
              <h2 className="text-lg font-black leading-none">{copy.brand}</h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-6">{copy.about}</p>
        </div>

        {/* Links 1 */}
        <div>
          <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-primary">{copy.explore}</h3>
          <ul className="space-y-4 text-sm">
            {latestLinks.length ? (
              latestLinks.map((item) => (
                <li key={item.slug}>
                  <Link to={`/${lang}/blog/${item.slug}`} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500 dark:text-gray-400">
                {lang === 'ar' ? 'لا توجد مدونات بعد.' : 'No blogs yet.'}
              </li>
            )}
          </ul>
        </div>

        {/* Links 2 */}
        <div>
          <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-primary">{copy.links}</h3>
          <ul className="space-y-4 text-sm">
            {copy.quickLinks.map((label) => (
              <li key={label}>
                {label === (lang === 'ar' ? 'من نحن' : 'About us') ? (
                  <Link to={`/${lang}/about`} className="hover:text-white transition-colors">{label}</Link>
                ) : (
                  <a href="#" className="hover:text-white transition-colors">{label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-primary">{copy.contact}</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5 dark:text-gray-500" />
              <span>{copy.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-500" />
              <span>{copy.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-600">
        <p>{copy.copyright}</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span>{copy.credit}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
