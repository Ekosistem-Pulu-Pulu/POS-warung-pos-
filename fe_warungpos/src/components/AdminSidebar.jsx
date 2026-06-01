import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-[260px] bg-slate-950 text-white min-h-screen flex flex-col shadow-2xl relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
      
      <div className="p-6 border-b border-slate-800/50 relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            WarungPOS
          </h1>
        </div>
        <p className="text-slate-400 text-xs font-medium ml-11 uppercase tracking-wider">Superadmin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 relative z-10">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              isActive
                ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/10 text-purple-400 border border-purple-500/20 shadow-[0_4px_20px_rgba(147,51,234,0.15)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/stores"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              isActive
                ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/10 text-purple-400 border border-purple-500/20 shadow-[0_4px_20px_rgba(147,51,234,0.15)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`
          }
        >
          <Store size={20} />
          <span>Manajemen Toko</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-slate-800/50 relative z-10">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
