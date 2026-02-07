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
        {['Sessions (7d)', 'Top Pages', 'Active Users'].map((label, index) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-300">{label}</div>
            <div className="text-2xl font-bold mt-2">{data?.kpis?.[index] ?? '—'}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-xs text-gray-300 mb-2">Top Pages (7d)</div>
        <div className="text-sm">
          {(data?.topPages ?? ['/', '/ar/blog', '/en/blog']).map((page: string) => (
            <div key={page} className="py-2 border-b border-white/5 last:border-none">{page}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
