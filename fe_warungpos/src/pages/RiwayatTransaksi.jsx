import { useState, useContext } from 'react';
import { Search, Filter, Calendar, Download, Eye, ArrowUpDown, X, Printer, CheckCircle2 } from 'lucide-react';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { motion, AnimatePresence } from 'framer-motion';

const initialMockHistory = [
  { id: 'INV-102934', user: 'USR-001 (Budi)', total: 152000, status: 'Sukses', date: '2026-05-23 10:42', method: 'SmartBank Pay' },
  { id: 'INV-102933', user: 'USR-045 (Siti)', total: 45500, status: 'Sukses', date: '2026-05-23 09:15', method: 'Cash' },
  { id: 'INV-102932', user: 'USR-012 (Andi)', total: 210000, status: 'Pending', date: '2026-05-22 18:05', method: 'Transfer' },
  { id: 'INV-102931', user: 'USR-088 (Dina)', total: 75000, status: 'Sukses', date: '2026-05-22 15:30', method: 'SmartBank Pay' },
  { id: 'INV-102930', user: 'USR-003 (Rudi)', total: 320000, status: 'Gagal', date: '2026-05-22 14:20', method: 'Card' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Sukses': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    'Gagal': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[status]}`}>
      {status === 'Sukses' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
      {status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>}
      {status === 'Gagal' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
      {status}
    </span>
  );
};

// Vercel/Linear style Modal variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.3 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -10, 
    filter: 'blur(2px)',
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

const RiwayatTransaksi = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { demoTransactions } = useContext(WorkspaceContext);
  const [selectedTrx, setSelectedTrx] = useState(null); // Modal state
  
  const displayHistory = demoTransactions.length > 0 ? demoTransactions : initialMockHistory;

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Riwayat Transaksi</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola dan pantau seluruh transaksi kasir.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </motion.button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari invoice atau pelanggan..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all placeholder-slate-400 text-slate-800 dark:text-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
              <Calendar size={16} className="text-slate-400" />
              <span>Hari Ini</span>
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
              <Filter size={16} className="text-slate-400" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto max-h-[600px] custom-scrollbar relative">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold shadow-sm">
                <th className="p-4 pl-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  <div className="flex items-center gap-1">No. Invoice <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" /></div>
                </th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Tanggal & Waktu</th>
                <th className="p-4">Metode</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayHistory.map((trx, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="p-4 pl-6">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">{trx.id}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{trx.user}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{trx.date}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                      {trx.method}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-slate-800 dark:text-white">Rp {trx.total.toLocaleString('id-ID')}</span>
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge status={trx.status} />
                  </td>
                  <td className="p-4 pr-6 text-center">
                    <button 
                      onClick={() => setSelectedTrx(trx)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors inline-flex"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto custom-scrollbar">
          {displayHistory.map((trx, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx} 
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm block mb-0.5">{trx.id}</span>
                  <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{trx.user}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Rp {trx.total.toLocaleString('id-ID')}</span>
                  <StatusBadge status={trx.status} />
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} /> {trx.date}
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-medium bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                    {trx.method}
                  </div>
                  <button onClick={() => setSelectedTrx(trx)} className="p-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 rounded-b-3xl">
          <div className="hidden sm:block font-medium">Menampilkan 1 - {Math.min(10, displayHistory.length)} dari {displayHistory.length} transaksi</div>
          <div className="flex gap-1.5 w-full sm:w-auto justify-center">
            <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium disabled:opacity-50 transition-colors" disabled>Prev</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium shadow-sm shadow-blue-200 dark:shadow-none">1</button>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Modal Detail Transaksi (Vercel/Linear Style) */}
      <AnimatePresence>
        {selectedTrx && (
          <motion.div 
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedTrx(null)}
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()} // Prevent click from closing modal
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Detail Transaksi</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTrx.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTrx(null)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 border-dashed">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Total Pembayaran</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Rp {selectedTrx.total.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Pelanggan</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTrx.user}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Metode</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTrx.method}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Tanggal</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTrx.date}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                    <StatusBadge status={selectedTrx.status} />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                  <Printer size={16} /> Cetak Struk
                </button>
                <button onClick={() => setSelectedTrx(null)} className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 active:scale-95">
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

export default RiwayatTransaksi;
