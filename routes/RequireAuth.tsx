import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAuth: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
};

export default RequireAuth;
