import type { AuthUser } from '../context/AuthContext';

const API_BASE = '/api';

const getCsrfToken = () => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.split('; ').find((row) => row.startsWith('csrf_token='));
  return match ? decodeURIComponent(match.split('=')[1]) : '';
};

const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const csrf = getCsrfToken();
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrf ? { 'x-csrf-token': csrf } : {}),
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || res.statusText);
  }
  return res.json() as Promise<T>;
};

export const login = (email: string, password: string) =>
  request<{ ok: true }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const logout = () => request<{ ok: true }>('/auth/logout', { method: 'POST' });

export const getMe = () => request<AuthUser>('/auth/me');

export const fetchDashboard = () => request('/analytics/summary');
export const fetchBotStats = () => request('/analytics/bots');
export const trackPageView = (payload: { path: string; lang?: string; referrer?: string }) =>
  request('/analytics/track', { method: 'POST', body: JSON.stringify(payload) });

export const fetchPosts = () => request('/posts');
export const fetchPost = (id: string) => request(`/posts/${id}`);
export const fetchPostPreview = (id: string) => request(`/posts/preview/${id}`);
export const fetchPostRevisions = (id: string) => request(`/posts/${id}/revisions`);
export const restorePostRevision = (id: string, revisionId: string) =>
  request(`/posts/${id}/revisions/${revisionId}/restore`, { method: 'POST' });
export const fetchPublicPosts = (lang: 'ar' | 'en', categorySlug?: string) =>
  request(`/posts/public?lang=${lang}${categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : ''}`);
export const fetchPublicPost = (lang: 'ar' | 'en', slug: string) => request(`/posts/public/${slug}?lang=${lang}`);

export const uploadImage = async (file: File) => {
  const csrf = getCsrfToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/uploads/images`, {
    method: 'POST',
    credentials: 'include',
    body: form,
    headers: csrf ? { 'x-csrf-token': csrf } : undefined
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || res.statusText);
  }
  return res.json() as Promise<{ url: string }>;
};

export const fetchUploads = () =>
  request<{ name: string; url: string; tags?: string[]; size?: number; mime?: string; created_at?: string; usage_count?: number }[]>(
    '/uploads/images'
  );

export const deleteUpload = (name: string, force = false) =>
  request<{ ok: boolean; reason?: string }>(`/uploads/images/${encodeURIComponent(name)}${force ? '?force=1' : ''}`, { method: 'DELETE' });
export const updateUploadTags = (name: string, tags: string[]) =>
  request(`/uploads/images/${encodeURIComponent(name)}`, { method: 'PATCH', body: JSON.stringify({ tags }) });
export const createPost = (payload: Record<string, unknown>) =>
  request('/posts', { method: 'POST', body: JSON.stringify(payload) });
export const updatePost = (id: string, payload: Record<string, unknown>) =>
  request(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const fetchCategories = () => request('/categories');
export const fetchPublicCategories = () => request('/categories/public');
export const createCategory = (payload: Record<string, unknown>) =>
  request('/categories', { method: 'POST', body: JSON.stringify(payload) });

export const fetchTags = () => request('/tags');
export const createTag = (payload: Record<string, unknown>) =>
  request('/tags', { method: 'POST', body: JSON.stringify(payload) });

export const fetchUsers = () => request('/users');
export const createUser = (payload: Record<string, unknown>) =>
  request('/users', { method: 'POST', body: JSON.stringify(payload) });
export const updateUser = (id: string, payload: Record<string, unknown>) =>
  request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteUser = (id: string) =>
  request(`/users/${id}`, { method: 'DELETE' });
export const resetUserPassword = (id: string, payload: Record<string, unknown>) =>
  request(`/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify(payload) });

export const fetchLogs = (query = '') => request(`/logs${query}`);

export const fetchSettings = () => request('/settings');
export const updateSettings = (payload: Record<string, unknown>) =>
  request('/settings', { method: 'PATCH', body: JSON.stringify(payload) });
export const fetchPublicSettings = () => request('/settings/public');

export const fetchNotifications = () => request('/notifications');
export const fetchUnreadNotificationsCount = () => request('/notifications/unread-count');
export const markNotificationRead = (id: string) =>
  request(`/notifications/${id}/read`, { method: 'PATCH' });
export const markAllNotificationsRead = () =>
  request('/notifications/read-all', { method: 'PATCH' });

export const downloadDbBackup = async () => {
  const csrf = getCsrfToken();
  const res = await fetch(`${API_BASE}/db-tools/backup`, { method: 'POST', credentials: 'include' });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || res.statusText);
  }
  return res.blob();
};

export const restoreDbBackup = async (file: File) => {
  const csrf = getCsrfToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/db-tools/restore`, {
    method: 'POST',
    credentials: 'include',
    body: form,
    headers: csrf ? { 'x-csrf-token': csrf } : undefined
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || res.statusText);
  }
  return res.json();
};
