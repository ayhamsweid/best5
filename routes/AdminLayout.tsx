import React, { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import ContentLoading from '../components/ContentLoading';
import { useRouteTransition } from '../context/RouteTransitionContext';
import { fetchUnreadNotificationsCount } from '../services/api';

const navItem = () => ({ isActive }: { isActive: boolean }) =>
  [
    'px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-between border',
    isActive
      ? 'bg-primary text-[#0f172a] border-primary/50 shadow-lg shadow-primary/30'
      : 'text-gray-600 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:border-white/10'
  ].join(' ');

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const isBuilder = location.pathname.includes('/admin/posts/edit/') || location.pathname.includes('/admin/posts/preview/');
  const { isPending } = useRouteTransition();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadNotificationsCount()
      .then((data: any) => setUnreadCount(Number(data) || 0))
      .catch(() => setUnreadCount(0));
  }, [location.pathname]);

  if (isBuilder) {
    return (
      <div className="relative">
        <Suspense fallback={<ContentLoading />}>
          <Outlet />
        </Suspense>
        {isPending && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-gray-50/95 dark:bg-[#0b1224]/95">
            <ContentLoading />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b1224] dark:text-white">
      <div className="border-b border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary text-[#0f172a] flex items-center justify-center font-black">B</div>
            <Link to="/admin/dashboard" className="font-black tracking-wide">Besiktas Admin</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/admin/notifications" className="relative text-xs text-gray-500 dark:text-gray-300">
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-[#0f172a] text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="text-xs text-gray-500 dark:text-gray-300">/admin</div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm dark:bg-white/5 dark:border-white/10 dark:shadow-none">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Main</div>
            <nav className="space-y-2">
              <NavLink to="/admin/dashboard" className={navItem()}>Dashboard</NavLink>
              <NavLink to="/admin/home" className={navItem()}>Home Page</NavLink>
              <NavLink to="/admin/posts" className={navItem()}>Posts</NavLink>
              <NavLink to="/admin/media" className={navItem()}>Media</NavLink>
              <NavLink to="/admin/categories" className={navItem()}>Categories</NavLink>
              <NavLink to="/admin/tags" className={navItem()}>Tags</NavLink>
              <NavLink to="/admin/header-footer" className={navItem()}>Header & Footer</NavLink>
              <NavLink to="/admin/pages" className={navItem()}>Static Pages</NavLink>
            </nav>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm dark:bg-white/5 dark:border-white/10 dark:shadow-none">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Admin</div>
            <nav className="space-y-2">
              <NavLink to="/admin/notifications" className={navItem()}>Notifications</NavLink>
              <NavLink to="/admin/crawlers" className={navItem()}>Crawler Analytics</NavLink>
              <NavLink to="/admin/search-console" className={navItem()}>Search Console</NavLink>
              <NavLink to="/admin/users" className={navItem()}>Users</NavLink>
              <NavLink to="/admin/logs" className={navItem()}>Audit Logs</NavLink>
              <NavLink to="/admin/settings" className={navItem()}>Settings</NavLink>
              <NavLink to="/admin/db-tools" className={navItem()}>Database Tools</NavLink>
            </nav>
          </div>
        </aside>
        <section className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-xl dark:bg-white/5 dark:border-white/10 dark:shadow-2xl">
          <Suspense fallback={<ContentLoading />}>
            <Outlet />
          </Suspense>
          {isPending && (
            <div className="pointer-events-none absolute inset-0 z-10 bg-gray-50/95 dark:bg-[#0b1224]/95">
              <ContentLoading />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
