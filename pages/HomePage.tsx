import React, { useEffect, useMemo, useState } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import LatestPosts from '../components/LatestPosts';
import Features from '../components/Features';
import Newsletter from '../components/Newsletter';
import { fetchPublicSettings } from '../services/api';

const HomePage: React.FC = () => {
  const [homeConfig, setHomeConfig] = useState<any>(null);

  useEffect(() => {
    fetchPublicSettings()
      .then((data) => setHomeConfig(data?.home_json || null))
      .catch(() => setHomeConfig(null));
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-animate="fade-up"]'));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const sectionsOrder = useMemo(() => {
    return homeConfig?.sections?.order || ['categories', 'latest', 'features', 'newsletter'];
  }, [homeConfig]);

  const sectionsEnabled = useMemo(() => {
    return {
      categories: true,
      latest: true,
      features: true,
      newsletter: true,
      ...(homeConfig?.sections?.enabled || {})
    };
  }, [homeConfig]);

  const sectionMap = useMemo(
    () => ({
      categories: <Categories />,
      latest: <LatestPosts config={homeConfig?.latestPosts} />,
      features: <Features config={homeConfig?.features} />,
      newsletter: <Newsletter />
    }),
    [homeConfig]
  );

  return (
    <>
      <Hero content={homeConfig?.hero} />
      {sectionsOrder.map((key: string) =>
        sectionsEnabled[key] && sectionMap[key] ? (
          <div key={key} className="fade-in-up" data-animate="fade-up">
            {sectionMap[key]}
          </div>
        ) : null
      )}
    </>
  );
};

export default HomePage;
