import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, User, Store, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    store_name: '',
    address: '',
    phone: '',
    owner_name: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/register-store', formData);
      toast.success('Pendaftaran Berhasil!', {
        description: 'Toko Anda berhasil didaftarkan. Silakan login.'
      });
      navigate('/login');
    } catch (err) {
      toast.error('Gagal Mendaftar', {
        description: err.response?.data?.error || err.response?.data?.message || 'Pastikan semua data valid dan tidak ada duplikasi.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <div className="w-full flex flex-col justify-center px-8 py-12 relative z-10 bg-white dark:bg-slate-900 shadow-2xl transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl mx-auto"
        >
          {/* Logo & Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShoppingCart className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Warung<span className="text-blue-600">POS</span></span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Daftar Toko Baru</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Bergabunglah dan mulai kelola bisnis Anda secara digital, gratis!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-600 border-b pb-2 dark:border-slate-800">Informasi Toko</h3>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Toko</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Store size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" name="store_name" required value={formData.store_name} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all dark:text-white shadow-sm"
                      placeholder="Toko Subur"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">No. Telepon</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" name="phone" required value={formData.phone} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all dark:text-white shadow-sm"
                      placeholder="0812..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat</label>
                  <div className="relative group">
                    <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                      <MapPin size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <textarea 
                      name="address" required value={formData.address} onChange={handleChange} rows="2"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all dark:text-white shadow-sm"
                      placeholder="Jl. Raya No. 1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-blue-600 border-b pb-2 dark:border-slate-800">Informasi Pemilik</h3>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" name="owner_name" required value={formData.owner_name} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all dark:text-white shadow-sm"
                      placeholder="Budi Santoso"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" name="username" required value={formData.username} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all dark:text-white shadow-sm"
                      placeholder="budisantoso"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all dark:text-white shadow-sm"
                      placeholder="budi@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="password" name="password" required value={formData.password} onChange={handleChange} minLength="6"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all dark:text-white shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]
                  ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Daftarkan Toko Secara Gratis</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium mt-4">
              Sudah punya akun? <a href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold transition-colors">Masuk di sini</a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
