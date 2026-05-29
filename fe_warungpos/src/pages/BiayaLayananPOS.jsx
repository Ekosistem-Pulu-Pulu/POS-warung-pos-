import { PieChart as PieChartIcon, ShieldCheck, Banknote } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion } from 'framer-motion';

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const dataBiaya = [
  { name: 'Fee POS (1%)', value: 450000, color: '#3b82f6' },
  { name: 'Fee Gateway (0.5%)', value: 225000, color: '#f59e0b' },
  { name: 'Fee Bank (1%)', value: 450000, color: '#10b981' },
  { name: 'Pajak Sistem (2%)', value: 900000, color: '#8b5cf6' },
];

const BiayaLayananPOS = () => {
  const totalPotongan = dataBiaya.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Biaya Layanan POS</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Rincian fee transaksi, gateway, dan pajak sistem.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Banknote size={160} />
          </div>
          <div className="relative z-10">
            <h2 className="text-blue-100 font-bold mb-1 text-sm tracking-wide">TOTAL POTONGAN BULAN INI</h2>
            <p className="text-4xl font-black mb-6 tracking-tight">Rp {totalPotongan.toLocaleString('id-ID')}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <span className="flex items-center gap-2 font-medium"><ShieldCheck size={16} /> Total Transaksi</span>
                <span className="font-bold">Rp 45.000.000</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <span className="font-medium">Estimasi Bersih</span>
                <span className="font-bold">Rp {(45000000 - totalPotongan).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart & Details */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-blue-600 dark:text-blue-400" />
            Distribusi Biaya Layanan
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-64 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataBiaya}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {dataBiaya.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-slate-900)', color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-3">
              {dataBiaya.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-800 dark:text-white text-sm">Rp {item.value.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Information Table */}
        <motion.div variants={itemVariants} className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80">
            <h3 className="font-bold text-slate-800 dark:text-white">Skema Biaya per Transaksi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-5 font-semibold">Jenis Biaya</th>
                  <th className="p-5 font-semibold">Persentase</th>
                  <th className="p-5 font-semibold">Penerima</th>
                  <th className="p-5 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-5 font-bold text-slate-800 dark:text-slate-200">Fee POS</td>
                  <td className="p-5 text-blue-600 dark:text-blue-400 font-black">1.0%</td>
                  <td className="p-5 font-semibold text-slate-600 dark:text-slate-300">Sistem WarungPOS</td>
                  <td className="p-5 text-slate-500 dark:text-slate-400 font-medium">Biaya layanan aplikasi dan maintenance</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-5 font-bold text-slate-800 dark:text-slate-200">Fee Gateway</td>
                  <td className="p-5 text-orange-600 dark:text-orange-400 font-black">0.5%</td>
                  <td className="p-5 font-semibold text-slate-600 dark:text-slate-300">SmartBank API</td>
                  <td className="p-5 text-slate-500 dark:text-slate-400 font-medium">Biaya routing dan integrasi API</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-5 font-bold text-slate-800 dark:text-slate-200">Fee Bank</td>
                  <td className="p-5 text-emerald-600 dark:text-emerald-400 font-black">1.0%</td>
                  <td className="p-5 font-semibold text-slate-600 dark:text-slate-300">Bank Terkait</td>
                  <td className="p-5 text-slate-500 dark:text-slate-400 font-medium">Biaya switching antar bank / principal</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-5 font-bold text-slate-800 dark:text-slate-200">Pajak Sistem</td>
                  <td className="p-5 text-purple-600 dark:text-purple-400 font-black">2.0%</td>
                  <td className="p-5 font-semibold text-slate-600 dark:text-slate-300">Pemerintah</td>
                  <td className="p-5 text-slate-500 dark:text-slate-400 font-medium">Pajak digital PPN 11% dari total fee</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BiayaLayananPOS;
