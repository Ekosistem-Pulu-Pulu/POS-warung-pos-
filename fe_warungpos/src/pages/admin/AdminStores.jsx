import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Store as StoreIcon, Phone, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [formData, setFormData] = useState({
    store_name: '', address: '', phone: '',
    owner_name: '', username: '', email: '', password: '', plan: 'basic'
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get('/admin/stores');
      setStores(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/stores/${id}/status`, { is_active: !currentStatus });
      fetchStores();
    } catch (err) {
      alert('Gagal merubah status toko');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stores', formData);
      setShowModal(false);
      fetchStores();
      setFormData({
        store_name: '', address: '', phone: '',
        owner_name: '', username: '', email: '', password: '', plan: 'basic'
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Gagal membuat toko';
      alert(errorMsg);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Toko</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola penyewa aplikasi dan status langganan mereka</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 font-medium"
        >
          <Plus size={18} />
          <span>Daftarkan Toko</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Nama Toko</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Kontak</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Paket</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 text-slate-400 font-medium">#{store.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform cursor-pointer" 
                        onClick={() => { setSelectedStore(store); setShowDetailModal(true); }}
                      >
                        <StoreIcon size={18} />
                      </div>
                      <span 
                        className="font-semibold text-slate-800 cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => { setSelectedStore(store); setShowDetailModal(true); }}
                      >
                        {store.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <Phone size={14} className="text-slate-400" />
                      <span className="text-sm font-medium">{store.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-xs">{store.address || '-'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize font-bold text-slate-700">{store.subscription?.plan || 'Free'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${store.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${store.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {store.is_active ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => toggleStatus(store.id, store.is_active)}
                        className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                          store.is_active 
                            ? 'bg-slate-50 text-amber-600 hover:bg-amber-50 hover:text-amber-700' 
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
                        }`}
                      >
                        {store.is_active ? 'Blokir' : 'Aktifkan'}
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Yakin hapus permanen toko ini? Semua data terkait (akun, transaksi) akan hilang!")) {
                            try {
                              await api.delete(`/admin/stores/${store.id}`);
                              fetchStores();
                            } catch (err) {
                              alert("Gagal menghapus toko");
                            }
                          }
                        }}
                        className="text-sm px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <StoreIcon size={48} className="text-slate-300" />
                      <p>Belum ada toko yang terdaftar.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Daftar Toko */}
      <AnimatePresence>
        {showModal && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pendaftaran Toko & Owner Baru</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                {/* Toko Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-purple-600 border-b pb-2">Informasi Toko</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
                    <input required type="text" className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 bg-white"
                      value={formData.store_name} onChange={e=>setFormData({...formData, store_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Telp</label>
                    <input type="text" className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 bg-white"
                      value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                    <textarea className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 bg-white"
                      value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paket Langganan (Awal)</label>
                    <select className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 bg-white"
                      value={formData.plan} onChange={e=>setFormData({...formData, plan: e.target.value})}>
                      <option value="basic">Basic (Gratis)</option>
                      <option value="pro">Pro (Rp 99.000)</option>
                      <option value="enterprise">Enterprise (Rp 299.000)</option>
                    </select>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-purple-600 border-b pb-2">Informasi Akun Owner</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
                    <input required type="text" className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 bg-white"
                      value={formData.owner_name} onChange={e=>setFormData({...formData, owner_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 bg-white"
                      value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input required type="text" className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 bg-white"
                      value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Sementara</label>
                    <input required type="text" className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 bg-white"
                      value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 mt-6 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors font-medium">Batal</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors font-medium shadow-md">Simpan & Daftarkan</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detail Toko */}
      <AnimatePresence>
        {showDetailModal && selectedStore && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if(e.target === e.currentTarget) setShowDetailModal(false); }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Detail Toko</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <StoreIcon size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selectedStore.name}</h3>
                  <p className="text-sm text-slate-500">ID: #{selectedStore.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1 uppercase font-semibold">Kontak</p>
                  <p className="text-slate-800 font-medium">{selectedStore.phone || '-'}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1 uppercase font-semibold">Status Langganan</p>
                  <p className="capitalize font-bold text-purple-600">{selectedStore.subscription?.plan || 'Free'}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 mb-1 uppercase font-semibold">Nama Pemilik</p>
                <p className="text-slate-800 text-sm font-medium">{selectedStore.owner?.name || 'Tidak diketahui'}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 mb-1 uppercase font-semibold">Alamat</p>
                <p className="text-slate-800 text-sm">{selectedStore.address || 'Belum ada alamat'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 mb-2 uppercase font-semibold">Tanggal Bergabung</p>
                <p className="text-slate-800 text-sm">
                  {new Date(selectedStore.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminStores;
