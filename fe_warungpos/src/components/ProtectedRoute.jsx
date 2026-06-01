import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika superadmin mencoba akses route tenant biasa, lempar ke admin dashboard
  if (user?.role === 'superadmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Jika lolos, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
