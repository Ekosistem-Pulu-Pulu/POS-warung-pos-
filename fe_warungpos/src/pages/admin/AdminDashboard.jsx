import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Store, CheckCircle, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_stores: 0,
    active_stores: 0,
    total_users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data && res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview Platform</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau perkembangan seluruh ekosistem WarungPOS</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
            <Store size={100} />
          </div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3.5 bg-purple-100 text-purple-600 rounded-2xl shadow-inner">
              <Store size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Warung</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.total_stores}</h3>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
            <CheckCircle size={100} />
          </div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-2xl shadow-inner">
              <CheckCircle size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Warung Aktif</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.active_stores}</h3>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
            <Users size={100} />
          </div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3.5 bg-blue-100 text-blue-600 rounded-2xl shadow-inner">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Pengguna</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.total_users}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
