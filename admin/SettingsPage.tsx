import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '../services/api';

const SettingsPage: React.FC = () => {
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchSettings().then(setValues).catch(() => setValues({}));
  }, []);

  const update = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const onSave = async () => {
    const updated = await updateSettings(values);
    setValues(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Settings</h1>
        <button onClick={onSave} className="bg-primary text-white px-4 py-2 rounded-lg text-sm">Save</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="GA4 Measurement ID" value={values.ga4_measurement_id || ''} onChange={(e) => update('ga4_measurement_id', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Site Name (AR)" value={values.site_name_ar || ''} onChange={(e) => update('site_name_ar', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Site Name (EN)" value={values.site_name_en || ''} onChange={(e) => update('site_name_en', e.target.value)} />
        <input className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Default Language" value={values.default_language || ''} onChange={(e) => update('default_language', e.target.value)} />
      </div>
    </div>
  );
};

export default SettingsPage;
