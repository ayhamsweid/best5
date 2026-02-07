import { useEffect } from 'react';

const Ga4Loader: React.FC<{ measurementId?: string | null }> = ({ measurementId }) => {
  useEffect(() => {
    if (!measurementId) return;
    const existing = document.querySelector(`script[data-ga4="${measurementId}"]`);
    if (existing) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.setAttribute('data-ga4', measurementId);
    document.head.appendChild(script);

    const inline = document.createElement('script');
    inline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(inline);
  }, [measurementId]);

  return null;
};

export default Ga4Loader;
