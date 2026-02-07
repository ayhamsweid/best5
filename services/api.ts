import type { AuthUser } from '../context/AuthContext';

const API_BASE = '/api';

const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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

export const fetchPosts = () => request('/posts');
export const fetchPost = (id: string) => request(`/posts/${id}`);
export const fetchPublicPosts = (lang: 'ar' | 'en') => request(`/posts/public?lang=${lang}`);
export const fetchPublicPost = (lang: 'ar' | 'en', slug: string) => request(`/posts/public/${slug}?lang=${lang}`);
export const createPost = (payload: Record<string, unknown>) =>
  request('/posts', { method: 'POST', body: JSON.stringify(payload) });
export const updatePost = (id: string, payload: Record<string, unknown>) =>
  request(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const fetchCategories = () => request('/categories');
export const createCategory = (payload: Record<string, unknown>) =>
  request('/categories', { method: 'POST', body: JSON.stringify(payload) });

export const fetchTags = () => request('/tags');
export const createTag = (payload: Record<string, unknown>) =>
  request('/tags', { method: 'POST', body: JSON.stringify(payload) });

export const fetchUsers = () => request('/users');
export const updateUser = (id: string, payload: Record<string, unknown>) =>
  request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const fetchLogs = (query = '') => request(`/logs${query}`);

export const fetchSettings = () => request('/settings');
export const updateSettings = (payload: Record<string, unknown>) =>
  request('/settings', { method: 'PATCH', body: JSON.stringify(payload) });
export const fetchPublicSettings = () => request('/settings/public');
