import React, { useEffect, useMemo, useState } from 'react';
import { deleteUpload, fetchUploads, uploadImage } from '../services/api';

const MediaPage: React.FC = () => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ name: string; url: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedSet, setSelectedSet] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchUploads().then(setFiles).catch(() => setFiles([]));
  }, []);

  const filtered = useMemo(() => {
    const sorted = [...files].sort((a, b) => b.name.localeCompare(a.name));
    if (!query) return sorted;
    const q = query.toLowerCase();
    return sorted.filter((file) => file.name.toLowerCase().includes(q));
  }, [files, query]);

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Copied link to clipboard');
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage('Failed to copy');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const onDelete = async (name: string) => {
    if (!confirm('Delete this image?')) return;
    await deleteUpload(name);
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const compressImage = async (file: File, maxWidth = 1600, quality = 0.8) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = url;
    });
    const scale = Math.min(1, maxWidth / img.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', quality)
    );
    URL.revokeObjectURL(url);
    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
  };

  const onUpload = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const result = await uploadImage(compressed);
      setFiles((prev) => [{ name: result.url.split('/').pop() || result.url, url: result.url }, ...prev]);
      setMessage('Uploaded successfully');
      setTimeout(() => setMessage(null), 2000);
    } catch (e: any) {
      setMessage(e?.message || 'Upload failed');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (name: string) => {
    setSelectedSet((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const selectedNames = useMemo(
    () => Object.keys(selectedSet).filter((k) => selectedSet[k]),
    [selectedSet]
  );

  const deleteSelected = async () => {
    if (selectedNames.length === 0) return;
    if (!confirm(`Delete ${selectedNames.length} images?`)) return;
    await Promise.all(selectedNames.map((name) => deleteUpload(name)));
    setFiles((prev) => prev.filter((f) => !selectedSet[f.name]));
    setSelectedSet({});
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Media Library</h1>
          <p className="text-xs text-gray-300 mt-1">All uploaded images.</p>
        </div>
        <input
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
          placeholder="Search by filename..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="file"
          accept="image/*"
          className="text-xs text-gray-300"
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
        {uploading && <span className="text-xs text-gray-400">Uploading...</span>}
        <button
          onClick={deleteSelected}
          className="text-xs px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30"
          disabled={selectedNames.length === 0}
        >
          Delete Selected ({selectedNames.length})
        </button>
      </div>
      {message && <div className="text-xs text-green-300 mb-3">{message}</div>}
      {filtered.length === 0 ? (
        <div className="text-sm text-gray-400">No images uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((file) => (
            <div key={file.url} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <label className="flex items-center gap-2 text-[10px] text-gray-300 mb-2">
                <input
                  type="checkbox"
                  checked={!!selectedSet[file.name]}
                  onChange={() => toggleSelect(file.name)}
                />
                Select
              </label>
              <button onClick={() => setSelected(file)} className="w-full">
                <img src={file.url} alt={file.name} className="w-full h-32 object-cover rounded-lg" />
              </button>
              <div className="text-[10px] text-gray-300 mt-2 truncate">{file.name}</div>
              <div className="text-[10px] text-gray-400 mt-1 truncate">{file.url}</div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => copyLink(file.url)}
                  className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10 hover:bg-white/20"
                >
                  Copy link
                </button>
                <button
                  onClick={() => onDelete(file.name)}
                  className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 max-w-3xl w-[90%]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-gray-300 truncate">{selected.name}</div>
              <button onClick={() => setSelected(null)} className="text-xs text-gray-300">Close</button>
            </div>
            <img src={selected.url} alt={selected.name} className="w-full max-h-[70vh] object-contain rounded-xl" />
            <div className="mt-3 text-[10px] text-gray-400 truncate">{selected.url}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
