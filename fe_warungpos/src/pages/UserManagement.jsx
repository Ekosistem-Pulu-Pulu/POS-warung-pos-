import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Plus, Shield, ShieldAlert, Key, Check, X } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Add User Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'kasir',
    smartbank_user_id: ''
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
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'kasir',
        smartbank_user_id: ''
      });
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
      // Update state locally to avoid full refetch if we want, but refetching is safer
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah status');
    }
  };

  if (isLoading && users.length === 0) return <div className="p-8 text-center text-gray-500">Memuat data user...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Manajemen User
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola akses kasir dan staff gudang.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm shadow-blue-200"
        >
          <Plus size={18} /> Tambah User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
          <ShieldAlert size={18} /> {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">Nama / Username</th>
                <th className="p-4 font-semibold">Kontak</th>
                <th className="p-4 font-semibold text-center">Role</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.smartbank_user_id && (
                      <p className="text-xs text-blue-600 mt-0.5">SB: {user.smartbank_user_id}</p>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                      ${user.role === 'owner' ? 'bg-purple-100 text-purple-700' : 
                        user.role === 'kasir' ? 'bg-blue-100 text-blue-700' : 
                        'bg-orange-100 text-orange-700'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                        <Check size={16} /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 text-sm font-medium">
                        <X size={16} /> Non-aktif
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {user.role !== 'owner' && (
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          user.is_active 
                            ? 'border-red-200 text-red-600 hover:bg-red-50' 
                            : 'border-green-200 text-green-600 hover:bg-green-50'
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

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Tambah User Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Misal: Budi Santoso" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input required type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="budisantoso" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white">
                    <option value="kasir">Kasir</option>
                    <option value="gudang">Gudang</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="budi@warungpos.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Key size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Minimal 6 karakter" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SmartBank User ID <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <input type="text" name="smartbank_user_id" value={formData.smartbank_user_id} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="SB-001" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
