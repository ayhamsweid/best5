import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LoadingShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1224] text-gray-900 dark:text-white flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-pulse text-sm text-gray-500 dark:text-gray-400">Loading…</div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingShell;
