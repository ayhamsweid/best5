import React, { createContext, useContext, useMemo, useState } from 'react';

type LanguageSwitchContextValue = {
  translatedPath?: string;
  setTranslatedPath: (path?: string) => void;
};

const LanguageSwitchContext = createContext<LanguageSwitchContextValue | null>(null);

export const LanguageSwitchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translatedPath, setTranslatedPath] = useState<string | undefined>();
  const value = useMemo(() => ({ translatedPath, setTranslatedPath }), [translatedPath]);

  return <LanguageSwitchContext.Provider value={value}>{children}</LanguageSwitchContext.Provider>;
};

export const useLanguageSwitch = () => {
  const context = useContext(LanguageSwitchContext);
  if (!context) throw new Error('useLanguageSwitch must be used inside LanguageSwitchProvider');
  return context;
};
