import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await login(identifier, password);
      toast.success('Login berhasil!', {
        description: `Selamat datang di WarungPOS.`
      });
      
      if (data.data.user.role === 'superadmin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error('Gagal Login', {
        description: err.response?.data?.message || 'Periksa kembali kredensial Anda.'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* KIRI: Form Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo & Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShoppingCart className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Warung<span className="text-blue-600">POS</span></span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Selamat Datang</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Masuk untuk mengelola transaksi bisnis Anda hari ini.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email atau Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all placeholder-slate-400 dark:text-white shadow-sm"
                  placeholder="BudiKasir01"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold transition-colors">Lupa sandi?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all placeholder-slate-400 dark:text-white shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
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
                    <span>Masuk ke Sistem</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
            
            <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium mt-4">
              Belum punya toko? <a href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold transition-colors">Daftar sekarang</a>
            </p>
          </form>
        </motion.div>
      </div>

      {/* KANAN: Branding (Hanya tampil di Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 relative overflow-hidden flex-col justify-center items-center p-12 transition-colors duration-300">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 dark:bg-blue-900/40 rounded-full blur-3xl transition-colors"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/20 dark:bg-indigo-900/40 rounded-full blur-3xl transition-colors"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg z-10"
        >
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-4">Ubah Cara Anda Berbisnis</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Sistem kasir cloud modern dengan analitik real-time, manajemen inventaris, dan integrasi pembayaran cerdas.</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
            {[
              { title: "Transaksi Secepat Kilat", desc: "Selesaikan pembayaran dalam hitungan detik tanpa hambatan.", iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
              { title: "Analitik Real-time", desc: "Pantau grafik pendapatan dan produk terlaris secara langsung.", iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
              { title: "Multi Cabang", desc: "Kelola semua outlet bisnis Anda dari satu dashboard terpusat.", iconBg: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${feature.iconBg}`}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
