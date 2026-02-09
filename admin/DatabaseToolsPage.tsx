import React, { useState } from 'react';
import { downloadDbBackup, restoreDbBackup } from '../services/api';

const DatabaseToolsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDownload = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const blob = await downloadDbBackup();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().slice(0, 19)}.sql`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to download backup');
    } finally {
      setLoading(false);
    }
  };

  const onRestore = async () => {
    if (!file) return;
    const confirmed = window.confirm('Restoring a backup will overwrite current data. Continue?');
    if (!confirmed) return;
    setLoading(true);
    setMessage(null);
    try {
      await restoreDbBackup(file);
      setMessage('Restore completed');
      setFile(null);
    } catch (e: any) {
      setMessage(e?.message || 'Restore failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Database Tools</h1>
        <p className="text-xs text-gray-300 mt-1">Enable with `ENABLE_DB_TOOLS=1`.</p>
      </div>

      {message && <div className="text-xs text-green-300">{message}</div>}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="text-sm font-semibold">Backup</div>
        <button
          onClick={onDownload}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
        >
          {loading ? 'Working...' : 'Download Backup'}
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="text-sm font-semibold text-red-300">Restore</div>
        <input
          type="file"
          accept=".sql"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs"
        />
        <button
          onClick={onRestore}
          disabled={loading || !file}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
        >
          {loading ? 'Working...' : 'Restore Backup'}
        </button>
      </div>
    </div>
  );
};

export default DatabaseToolsPage;
