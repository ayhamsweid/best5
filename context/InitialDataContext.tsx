import React, { createContext, useContext } from 'react';

export type InitialData = {
  lang?: 'ar' | 'en';
  settings?: any;
  posts?: any[];
  categoryPosts?: any[];
  popularPosts?: any[];
  categories?: any[];
  tags?: any[];
  post?: any | null;
  status?: number;
  siteUrl?: string;
};

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialData;
  }
}

const InitialDataContext = createContext<InitialData>({});

export const InitialDataProvider: React.FC<{
  data?: InitialData;
  children: React.ReactNode;
}> = ({ data = {}, children }) => (
  <InitialDataContext.Provider value={data}>{children}</InitialDataContext.Provider>
);

export const useInitialData = () => useContext(InitialDataContext);

export const useSiteUrl = () => {
  const { siteUrl } = useInitialData();
  if (siteUrl) return siteUrl.replace(/\/+$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://best5.com.tr';
};
