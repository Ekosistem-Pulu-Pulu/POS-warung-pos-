import { useContext } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, ArrowUpRight, Package, ArrowDownRight } from 'lucide-react';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { motion } from 'framer-motion';

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-slate-700">
        <p className="font-semibold mb-1 opacity-80">{label}</p>
        <p className="font-bold text-sm">Rp {payload[0].value.toLocaleString('id-ID')}</p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { demoStats, activeOutlet, demoProducts } = useContext(WorkspaceContext);

  // Convert productsSold object to sorted array with revenue
  const topProductsRaw = Object.entries(demoStats.productsSold || {}).map(([name, qty]) => {
    const prod = demoProducts.find(p => p.name === name);
    const price = prod ? prod.price : 10000; // fallback
    return { name, sales: qty, revenue: qty * price };
  }).sort((a, b) => b.sales - a.sales).slice(0, 5);

  const topProducts = topProductsRaw.length > 0 ? topProductsRaw : [
    { name: 'Belum ada data', sales: 0, revenue: 0 }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Analytics: {activeOutlet}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Laporan komprehensif performa penjualan secara realtime.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-500/20 group relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center gap-1 text-sm font-bold bg-white/20 px-2.5 py-1 rounded-xl backdrop-blur-sm border border-white/10">
              <ArrowUpRight size={14} strokeWidth={3} /> 14.5%
            </span>
          </div>
          <p className="text-indigo-100 text-sm font-medium tracking-wide">Total Revenue</p>
          <h3 className="text-3xl font-black mt-1 tracking-tight">Rp {(demoStats.revenue / 1000000).toFixed(2)}M</h3>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/20 group relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <ShoppingBag size={24} />
            </div>
            <span className="flex items-center gap-1 text-sm font-bold bg-white/20 px-2.5 py-1 rounded-xl backdrop-blur-sm border border-white/10">
              <ArrowUpRight size={14} strokeWidth={3} /> 8.2%
            </span>
          </div>
          <p className="text-blue-100 text-sm font-medium tracking-wide">Total Transaksi</p>
          <h3 className="text-3xl font-black mt-1 tracking-tight">{demoStats.trxCount}</h3>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-500/20 sm:col-span-2 lg:col-span-1 group relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Users size={24} />
            </div>
            <span className="flex items-center gap-1 text-sm font-bold bg-white/20 px-2.5 py-1 rounded-xl backdrop-blur-sm border border-white/10">
              <ArrowDownRight size={14} strokeWidth={3} className="text-rose-300" /> 2.1%
            </span>
          </div>
          <p className="text-emerald-100 text-sm font-medium tracking-wide">Pelanggan Aktif</p>
          <h3 className="text-3xl font-black mt-1 tracking-tight">{demoStats.customers}</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Pertumbuhan Pendapatan</h2>
          <div className="h-72 w-full min-h-[250px] relative">
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={demoStats.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Produk Terlaris</h2>
          <div className="flex-1">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-3 font-semibold">Produk</th>
                    <th className="pb-3 font-semibold text-center">Terjual</th>
                    <th className="pb-3 font-semibold text-right">Pendapatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {topProducts.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0
                            ${idx === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                              idx === 1 ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' : 
                              idx === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                              'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}
                          `}>
                            #{idx + 1}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{prod.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                        {prod.sales} <span className="text-[10px] text-slate-400 uppercase ml-0.5">pcs</span>
                      </td>
                      <td className="py-3 text-right text-slate-800 dark:text-white font-bold tracking-tight">Rp {prod.revenue.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 mt-2">
              {topProducts.map((prod, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0
                    ${idx === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                      idx === 1 ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 
                      idx === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}
                  `}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white truncate">{prod.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{prod.sales} terjual</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-slate-800 dark:text-white text-sm">Rp {(prod.revenue/1000).toFixed(0)}k</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
