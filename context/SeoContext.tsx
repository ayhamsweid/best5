import { createContext, useContext } from 'react';

export type SeoData = {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  url?: string;
  status?: number;
};

type SeoCollector = (data: SeoData) => void;

export const SeoCollectorContext = createContext<SeoCollector | null>(null);

export const useSeoCollector = () => useContext(SeoCollectorContext);
