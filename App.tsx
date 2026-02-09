import React, { lazy, useEffect, useState, useTransition } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PublicLayout from './routes/PublicLayout';
import AdminLayout from './routes/AdminLayout';
import RequireAuth from './routes/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RouteTransitionProvider } from './context/RouteTransitionContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const PublicPostPreviewPage = lazy(() => import('./pages/PublicPostPreviewPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const StaticPage = lazy(() => import('./pages/StaticPage'));

const LoginPage = lazy(() => import('./admin/LoginPage'));
const DashboardPage = lazy(() => import('./admin/DashboardPage'));
const HomePageSettingsPage = lazy(() => import('./admin/HomePageSettingsPage'));
const UsersPage = lazy(() => import('./admin/UsersPage'));
const LogsPage = lazy(() => import('./admin/LogsPage'));
const PostsListPage = lazy(() => import('./admin/PostsListPage'));
const PostCreatePage = lazy(() => import('./admin/PostCreatePage'));
const PostEditPage = lazy(() => import('./admin/PostEditPage'));
const PostPreviewPage = lazy(() => import('./admin/PostPreviewPage'));
const CategoriesPage = lazy(() => import('./admin/CategoriesPage'));
const TagsPage = lazy(() => import('./admin/TagsPage'));
const SettingsPage = lazy(() => import('./admin/SettingsPage'));
const HeaderFooterSettingsPage = lazy(() => import('./admin/HeaderFooterSettingsPage'));
const PagesSettingsPage = lazy(() => import('./admin/PagesSettingsPage'));
const DatabaseToolsPage = lazy(() => import('./admin/DatabaseToolsPage'));
const NotificationsPage = lazy(() => import('./admin/NotificationsPage'));
const BotAnalyticsPage = lazy(() => import('./admin/BotAnalyticsPage'));
const SearchConsolePage = lazy(() => import('./admin/SearchConsolePage'));
const MediaPage = lazy(() => import('./admin/MediaPage'));

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => setDisplayLocation(location));
  }, [location, startTransition]);

  return (
    <RouteTransitionProvider isPending={isPending}>
      <Routes location={displayLocation}>
        <Route path="/" element={<Navigate to="/ar" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="home" element={<HomePageSettingsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="posts" element={<PostsListPage />} />
            <Route path="posts/create" element={<PostCreatePage />} />
            <Route path="posts/edit/:id" element={<PostEditPage />} />
            <Route path="posts/preview/:id" element={<PostPreviewPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="tags" element={<TagsPage />} />
            <Route path="header-footer" element={<HeaderFooterSettingsPage />} />
            <Route path="pages" element={<PagesSettingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="db-tools" element={<DatabaseToolsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="crawlers" element={<BotAnalyticsPage />} />
            <Route path="search-console" element={<SearchConsolePage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>
        <Route path="/:lang/preview" element={<RequireAuth />}>
          <Route element={<PublicLayout />}>
            <Route path=":id" element={<PublicPostPreviewPage />} />
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
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<StaticPage slug="privacy" />} />
          <Route path="contact" element={<StaticPage slug="contact" />} />
          <Route path="advertise" element={<StaticPage slug="advertise" />} />
          <Route path="terms" element={<StaticPage slug="terms" />} />
          <Route path="cookies" element={<StaticPage slug="cookies" />} />
          <Route path="faq" element={<StaticPage slug="faq" />} />
        </Route>
        <Route path="*" element={<Navigate to="/ar" replace />} />
      </Routes>
    </RouteTransitionProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
