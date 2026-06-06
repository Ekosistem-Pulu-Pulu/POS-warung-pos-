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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-sm text-slate-500 font-medium">Total / Aktif Toko</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.total_stores} / {stats.active_stores}</h3>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-sm border border-emerald-500 hover:shadow-md transition-shadow relative overflow-hidden group text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
            <CheckCircle size={100} />
          </div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3.5 bg-white/20 text-white rounded-2xl shadow-inner">
              <span className="text-xl font-bold">Rp</span>
            </div>
            <div>
              <p className="text-sm text-emerald-100 font-medium">Pendapatan Platform</p>
              <h3 className="text-2xl font-black">Rp {(stats.total_platform_revenue || 0).toLocaleString('id-ID')}</h3>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
            <Users size={100} />
          </div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3.5 bg-amber-100 text-amber-600 rounded-2xl shadow-inner">
              <span className="text-xl font-bold">%</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pajak Sistem (2%)</p>
              <h3 className="text-2xl font-black text-slate-800">Rp {(stats.total_system_tax || 0).toLocaleString('id-ID')}</h3>
            </div>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3.5 bg-blue-100 text-blue-600 rounded-2xl shadow-inner">
              <span className="text-xl font-bold">📈</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">GMV / Transaksi</p>
              <h3 className="text-lg font-black text-slate-800">Rp {(stats.total_gmv || 0).toLocaleString('id-ID')} <span className="text-sm text-slate-400 font-normal">({stats.total_transactions} Trx)</span></h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
