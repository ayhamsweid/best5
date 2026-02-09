import React, { useEffect, useState } from 'react';
import { fetchBotStats } from '../services/api';

const BotAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchBotStats()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Crawler Analytics</h1>
          <p className="text-xs text-gray-300">Search engine and AI bot visits (last 7 days).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-300">Total bot hits (7d)</div>
          <div className="text-2xl font-bold mt-2">{data?.total ?? '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-300 mb-2">Top Bots</div>
          {(data?.topBots ?? []).length ? (
            data.topBots.map((row: any) => (
              <div key={row.bot} className="py-2 border-b border-white/5 last:border-none flex justify-between">
                <span>{row.bot}</span>
                <span className="text-xs text-gray-400">{row.count}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400">No data yet.</div>
          )}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-300 mb-2">Top Paths</div>
          {(data?.topPaths ?? []).length ? (
            data.topPaths.map((row: any) => (
              <div key={row.path} className="py-2 border-b border-white/5 last:border-none flex justify-between">
                <span>{row.path}</span>
                <span className="text-xs text-gray-400">{row.count}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400">No data yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotAnalyticsPage;
