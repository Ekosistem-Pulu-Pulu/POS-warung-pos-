import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const AdminLayout = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'superadmin') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header simple */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-gray-800 font-semibold text-lg">Platform Overview</h2>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
              SA
            </div>
            <span className="text-sm font-medium text-gray-700">Superadmin</span>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
