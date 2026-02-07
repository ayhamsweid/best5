import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './routes/PublicLayout';
import AdminLayout from './routes/AdminLayout';
import RequireAuth from './routes/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ComparePage from './pages/ComparePage';
import GuidePage from './pages/GuidePage';
import LoginPage from './admin/LoginPage';
import DashboardPage from './admin/DashboardPage';
import UsersPage from './admin/UsersPage';
import LogsPage from './admin/LogsPage';
import PostsListPage from './admin/PostsListPage';
import PostCreatePage from './admin/PostCreatePage';
import PostEditPage from './admin/PostEditPage';
import CategoriesPage from './admin/CategoriesPage';
import TagsPage from './admin/TagsPage';
import SettingsPage from './admin/SettingsPage';
import MediaPage from './admin/MediaPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/ar" replace />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<RequireAuth />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="posts" element={<PostsListPage />} />
              <Route path="posts/create" element={<PostCreatePage />} />
              <Route path="posts/edit/:id" element={<PostEditPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="tags" element={<TagsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>
          <Route path="/:lang" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="compare/:slug" element={<ComparePage />} />
            <Route path="guide/:slug" element={<GuidePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/ar" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
