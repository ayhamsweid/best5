import type { Lang } from '../hooks/useLang';

type Dictionary = Record<string, string>;

const ar: Dictionary = {
  home: 'الرئيسية',
  blog: 'المدونة',
  categories: 'الفئات',
  search: 'بحث',
  compare: 'مقارنات',
  login: 'تسجيل الدخول',
  dashboard: 'لوحة التحكم',
  users: 'المستخدمون',
  logs: 'سجل التدقيق',
  posts: 'المقالات',
  tags: 'الوسوم',
  settings: 'الإعدادات',
  welcome: 'دليل بشكتاش',
  admin: 'لوحة الإدارة'
};

const en: Dictionary = {
  home: 'Home',
  blog: 'Blog',
  categories: 'Categories',
  search: 'Search',
  compare: 'Comparisons',
  login: 'Login',
  dashboard: 'Dashboard',
  users: 'Users',
  logs: 'Audit Logs',
  posts: 'Posts',
  tags: 'Tags',
  settings: 'Settings',
  welcome: 'Besiktas City Guide',
  admin: 'Admin Panel'
};

export const t = (lang: Lang, key: keyof typeof ar) => {
  return (lang === 'ar' ? ar : en)[key] ?? key;
};
