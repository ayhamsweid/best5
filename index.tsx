import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { InitialData } from './context/InitialDataContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const readInitialData = (): InitialData | undefined => {
  const element = document.getElementById('__INITIAL_DATA__');
  if (!element?.textContent) return undefined;
  try {
    return JSON.parse(element.textContent) as InitialData;
  } catch {
    return undefined;
  }
};

const app = (
  <React.StrictMode>
    <App initialData={readInitialData()} />
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}

document.body.classList.add('app-ready');
