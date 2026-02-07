import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedGuides from '../components/FeaturedGuides';
import Features from '../components/Features';
import Newsletter from '../components/Newsletter';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedGuides />
      <Features />
      <Newsletter />
    </>
  );
};

export default HomePage;
