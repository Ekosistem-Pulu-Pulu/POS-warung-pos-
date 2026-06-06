import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Users,
  RefreshCcw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'sonner';

// --- Framer Motion Variants ---
const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 15, filter: 'blur(2px)' },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass, bgClass }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${bgClass} dark:opacity-10 dark:group-hover:opacity-20`}></div>
    
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide">{title}</h3>
      <div className={`w-10 h-10 rounded-xl ${bgClass} dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
        <Icon className={`${colorClass} dark:text-opacity-80`} size={20} />
      </div>
    </div>
    
    <div className="flex items-end gap-3">
      <p className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</p>
    </div>
    
    {trend && (
      <div className="mt-4 flex items-center gap-1.5 text-sm">
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-medium
          ${trend === 'up' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}
        `}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}%
        </div>
        <span className="text-slate-400 dark:text-slate-500">vs lalu</span>
      </div>
    )}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-slate-700"
      >
        <p className="font-semibold mb-1 opacity-80">{label}</p>
        <p className="font-bold text-sm">Rp {payload[0].value.toLocaleString('id-ID')}</p>
      </motion.div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pos/dashboard');
      if (res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Gagal memuat dashboard.</div>;

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pantau performa dan ringkasan transaksi secara realtime (Live Data).</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDashboard}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
          >
            <RefreshCcw size={14} />
            Refresh Data
          </button>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sistem Online</span>
          </div>
        </div>
      </motion.div>

      {/* Business Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <StatCard title="REVENUE HARI INI" value={`Rp ${data.revenue.toLocaleString('id-ID')}`} icon={DollarSign} colorClass="text-blue-600" bgClass="bg-blue-50" />
        </div>
        <div className="lg:col-span-2">
          <StatCard title="TRANSAKSI HARI INI" value={data.trxCount} icon={ShoppingCart} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        </div>
        <div className="lg:col-span-2">
          <StatCard title="PELANGGAN TRANSAKSI" value={data.customers} icon={Users} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500">
        {/* Main Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none transition-all duration-500 lg:col-span-2 h-[350px]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Tren Pendapatan</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Akumulasi 7 hari terakhir</p>
            </div>
            <select className="text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-medium py-1.5 px-3 outline-none">
              <option>7 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-[calc(100%-5rem)] w-full min-h-[250px] relative">
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `Rp${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Aktivitas Terakhir</h2>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {data.recent && data.recent.length > 0 ? (
              data.recent.map((trx, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className="group flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all cursor-default border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border
                      ${trx.status === 'Sukses' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' : 
                        trx.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800' : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800'}
                    `}>
                      <Activity size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{trx.user}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{trx.id} • {trx.time || trx.date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Rp {trx.amount ? trx.amount.toLocaleString('id-ID') : 0}</p>
                    <p className={`text-[11px] font-semibold uppercase tracking-wider mt-0.5
                      ${trx.status === 'Sukses' ? 'text-emerald-600 dark:text-emerald-400' : 
                        trx.status === 'Pending' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}
                    `}>
                      {trx.status}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center mt-10">Belum ada aktivitas transaksi.</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
