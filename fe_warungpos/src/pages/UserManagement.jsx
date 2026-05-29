import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Plus, ShieldAlert, Key, Check, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Add User Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', role: 'kasir', smartbank_user_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/auth/users');
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post('/auth/register', formData);
      setIsModalOpen(false);
      setFormData({ name: '', username: '', email: '', password: '', role: 'kasir', smartbank_user_id: '' });
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await api.put(`/auth/users/${id}/status`, { is_active: !currentStatus });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah status');
    }
  };

  if (isLoading && users.length === 0) return <div className="p-8 text-center text-slate-500">Memuat data user...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="text-blue-600 dark:text-blue-400" /> Manajemen User
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola akses kasir dan staf operasional.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium shadow-sm shadow-blue-600/20 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} /> Tambah User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-800/50 flex items-center gap-2">
          <ShieldAlert size={18} /> {error}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">
                <th className="p-4 pl-6 font-semibold">User Info</th>
                <th className="p-4 font-semibold">Kontak</th>
                <th className="p-4 font-semibold text-center">Role</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 pr-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{user.email}</p>
                    {user.smartbank_user_id && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">SB: {user.smartbank_user_id}</p>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize border
                      ${user.role === 'owner' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50' : 
                        user.role === 'kasir' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' : 
                        'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {user.is_active ? (
                      <span className="inline-flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1.5 text-red-500 text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-center">
                    {user.role !== 'owner' && (
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-colors ${
                          user.is_active 
                            ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/30' 
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
                        }`}
                      >
                        {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">@{user.username}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                ${user.role === 'owner' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 
                  user.role === 'kasir' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 
                  'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'}`}
              >
                {user.role}
              </span>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400">Email</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <span className={`font-semibold ${user.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {user.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>

            {user.role !== 'owner' && (
              <button 
                onClick={() => toggleUserStatus(user.id, user.is_active)}
                className={`w-full py-2.5 rounded-xl border font-bold text-sm transition-colors ${
                  user.is_active 
                    ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/30' 
                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
                }`}
              >
                {user.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tambah User Baru</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="Misal: Budi Santoso" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                    <input required type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="budisantoso" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white">
                      <option value="kasir">Kasir</option>
                      <option value="gudang">Gudang</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="budi@warungpos.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Key size={18} className="absolute left-3 top-3 text-slate-400" />
                    <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="Minimal 6 karakter" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold">
                    Batal
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold disabled:opacity-50 shadow-sm shadow-blue-600/20">
                    {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
