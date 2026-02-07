import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';

const navItem = () => ({ isActive }: { isActive: boolean }) =>
  [
    'px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-between',
    isActive ? 'bg-primary text-[#0f172a] shadow-lg shadow-primary/30' : 'text-gray-300 hover:bg-white/10'
  ].join(' ');

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b1224] text-white">
      <div className="border-b border-white/10 bg-[#0f172a]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary text-[#0f172a] flex items-center justify-center font-black">B</div>
            <Link to="/admin/dashboard" className="font-black tracking-wide">Besiktas Admin</Link>
          </div>
          <div className="text-xs text-gray-300">/admin</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-xs text-gray-400 mb-3">Main</div>
            <nav className="space-y-2">
              <NavLink to="/admin/dashboard" className={navItem()}>Dashboard</NavLink>
              <NavLink to="/admin/posts" className={navItem()}>Posts</NavLink>
              <NavLink to="/admin/media" className={navItem()}>Media</NavLink>
              <NavLink to="/admin/categories" className={navItem()}>Categories</NavLink>
              <NavLink to="/admin/tags" className={navItem()}>Tags</NavLink>
            </nav>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-xs text-gray-400 mb-3">Admin</div>
            <nav className="space-y-2">
              <NavLink to="/admin/users" className={navItem()}>Users</NavLink>
              <NavLink to="/admin/logs" className={navItem()}>Audit Logs</NavLink>
              <NavLink to="/admin/settings" className={navItem()}>Settings</NavLink>
            </nav>
          </div>
        </aside>
        <section className="bg-white/5 rounded-2xl border border-white/10 p-6 shadow-2xl">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
