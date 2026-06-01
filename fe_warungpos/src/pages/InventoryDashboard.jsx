import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, AlertTriangle, XCircle, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const InventoryDashboard = () => {
  const [stats, setStats] = useState({ total_products: 0, low_stock: 0, out_of_stock: 0 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, prodRes] = await Promise.all([
        api.get('/inventory/dashboard'),
        api.get('/inventory/products')
      ]);
      setStats(statsRes.data.data);
      setProducts(prodRes.data.data);
    } catch (err) {
      toast.error('Gagal memuat data inventaris');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gudang Stok</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola persediaan barang dan inventaris toko Anda</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/30">
          <Plus size={18} />
          <span>Tambah Barang</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Barang</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total_products}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stok Menipis</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.low_stock}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-xl">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stok Habis</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.out_of_stock}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">Daftar Inventaris</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari barang..." 
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="py-3 px-6 font-medium">Nama Barang</th>
                <th className="py-3 px-6 font-medium">Kategori</th>
                <th className="py-3 px-6 font-medium">Harga Jual</th>
                <th className="py-3 px-6 font-medium">Stok Saat Ini</th>
                <th className="py-3 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800 dark:text-white">{item.name}</td>
                  <td className="py-4 px-6 text-slate-500">{item.category || '-'}</td>
                  <td className="py-4 px-6 text-slate-600">Rp {item.price.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.stock <= item.min_stock ? (item.stock === 0 ? 'bg-red-500' : 'bg-amber-500') : 'bg-emerald-500'}`}></span>
                      <span className={`font-semibold ${item.stock <= item.min_stock ? (item.stock === 0 ? 'text-red-600' : 'text-amber-600') : 'text-slate-700 dark:text-slate-300'}`}>
                        {item.stock}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium">Restock</button>
                    <button className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Edit</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Belum ada barang di inventaris.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
