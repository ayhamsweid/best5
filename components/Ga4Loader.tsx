import { useEffect } from 'react';

const Ga4Loader: React.FC<{ measurementId?: string | null }> = ({ measurementId }) => {
  useEffect(() => {
    if (!measurementId) return;
    const existing = document.querySelector(
      `script[data-ga4="${measurementId}"], script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`
    );
    if (existing) return;
    const load = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.setAttribute('data-ga4', measurementId);
      script.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag =
          (window as any).gtag ||
          function gtag(...args: unknown[]) {
            (window as any).dataLayer.push(args);
          };
        (window as any).gtag('js', new Date());
        // Configure GA without automatic page_view, then explicitly send the initial page_view
        (window as any).gtag('config', measurementId, { send_page_view: false });
        try {
          (window as any).gtag('event', 'page_view', { page_path: window.location.pathname + window.location.search });
        } catch (err) {
          // ignore
        }
      };
      document.head.appendChild(script);
    };

    if (document.readyState === 'complete') {
      window.setTimeout(load, 0);
      return;
    }
    window.addEventListener('load', load, { once: true });
    return () => window.removeEventListener('load', load);
  }, [measurementId]);

  return null;
};

export default Ga4Loader;
