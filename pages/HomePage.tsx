import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedGuides from '../components/FeaturedGuides';
import Features from '../components/Features';
import Newsletter from '../components/Newsletter';

const HomePage: React.FC = () => {
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

  return (
    <>
      <Hero />
      <div className="fade-in-up" data-animate="fade-up">
        <Categories />
      </div>
      <div className="fade-in-up" data-animate="fade-up">
        <FeaturedGuides />
      </div>
      <div className="fade-in-up" data-animate="fade-up">
        <Features />
      </div>
      <div className="fade-in-up" data-animate="fade-up">
        <Newsletter />
      </div>
    </>
  );
};

export default HomePage;
