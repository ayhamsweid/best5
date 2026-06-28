import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppContent } from './App';
import { InitialData } from './context/InitialDataContext';
import { SeoCollectorContext, SeoData } from './context/SeoContext';

export const render = (url: string, initialData: InitialData) => {
  let seo: SeoData | null = null;
  const html = renderToString(
    <SeoCollectorContext.Provider value={(value) => { seo = value; }}>
      <StaticRouter location={url}>
        <AppContent initialData={initialData} />
      </StaticRouter>
    </SeoCollectorContext.Provider>
  );

  return { html, seo };
};
