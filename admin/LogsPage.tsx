import React, { useEffect, useState } from 'react';
import { fetchLogs } from '../services/api';

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs().then(setLogs).catch(() => setLogs([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Audit Logs</h1>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-300">{log.created_at}</div>
            <div className="font-semibold">{log.action_type} {log.entity_type}</div>
            <div className="text-xs text-gray-400">{log.actor_user_id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogsPage;
