import { useState, useEffect } from 'react';
import { Server, Activity, Clock, Shield, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const SmartBankStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, online, offline

  useEffect(() => {
    // Simulate pinging SmartBank Gateway
    const timer = setTimeout(() => {
      setStatus('online');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6 max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">SmartBank Gateway Status</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pantau konektivitas dan kesehatan API SmartBank real-time.</p>
      </motion.div>

      {/* Hero Status Card */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        <div className="absolute -right-10 -top-10 text-slate-50 dark:text-slate-800/50 opacity-50 transition-colors">
          <Server size={250} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            {status === 'checking' ? (
              <div className="w-32 h-32 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-blue-500 animate-spin flex items-center justify-center">
                <Activity className="text-blue-500 animate-pulse" size={40} />
              </div>
            ) : status === 'online' ? (
              <div className="w-32 h-32 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border-4 border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center transition-colors">
                <CheckCircle className="text-emerald-500 dark:text-emerald-400" size={50} />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-red-50 dark:bg-red-900/30 border-4 border-red-100 dark:border-red-800/50 flex items-center justify-center transition-colors">
                <XCircle className="text-red-500 dark:text-red-400" size={50} />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                {status === 'checking' ? 'Memeriksa Koneksi...' : status === 'online' ? 'Gateway Online' : 'Gateway Offline'}
              </h2>
              {status === 'online' && (
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Sistem terhubung dengan baik ke SmartBank Core API. Semua transaksi dapat diproses.</p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700/50 rounded-2xl p-4 min-w-[140px] transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-semibold">Latency</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">24 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">ms</span></p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700/50 rounded-2xl p-4 min-w-[140px] transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-semibold">Uptime</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">99.98<span className="text-sm font-medium text-slate-500 dark:text-slate-400">%</span></p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700/50 rounded-2xl p-4 min-w-[140px] transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-semibold">Last Sync</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Endpoint Status List */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-800 dark:text-white">Endpoint Status</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {[
            { name: 'POST /pos/pay', desc: 'Memproses pembayaran', status: 'Operational', time: '12ms' },
            { name: 'GET /pos/verify', desc: 'Verifikasi status transaksi', status: 'Operational', time: '18ms' },
            { name: 'GET /bank/balance', desc: 'Cek saldo rekening pooling', status: 'Operational', time: '45ms' },
            { name: 'POST /bank/settlement', desc: 'Settlement akhir hari', status: 'Operational', time: '120ms' },
          ].map((endpoint, idx) => (
            <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Shield size={20} className="text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">{endpoint.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{endpoint.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{endpoint.time}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">
                  {endpoint.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SmartBankStatus;
