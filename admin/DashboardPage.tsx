import React, { useEffect, useState } from 'react';
import { fetchDashboard } from '../services/api';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard().then(setData).catch(() => setData(null));
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Dashboard</h1>
          <p className="text-sm text-gray-300">KPIs and analytics overview.</p>
        </div>
        <a className="text-xs text-primary underline" href="https://analytics.google.com" target="_blank" rel="noreferrer">
          Open GA Report
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Views (7d)', value: data?.kpis?.views7d },
          { label: 'Views (24h)', value: data?.kpis?.views24h },
          { label: 'Tracked Pages', value: data?.kpis?.pagesTracked }
        ].map((item) => (
          <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-300">{item.label}</div>
            <div className="text-2xl font-bold mt-2">{item.value ?? '—'}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-xs text-gray-300 mb-2">Top Pages (7d)</div>
        <div className="text-sm">
          {(data?.topPages ?? []).length ? (
            data.topPages.map((row: { path: string; count: number }) => (
              <div key={row.path} className="py-2 border-b border-white/5 last:border-none flex justify-between">
                <span>{row.path}</span>
                <span className="text-xs text-gray-400">{row.count}</span>
              </div>
            ))
          ) : (
            <div className="py-2 text-gray-400">No data yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
