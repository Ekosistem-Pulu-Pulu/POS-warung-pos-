import { useState } from 'react';
import { Search, Filter, Calendar, Download, Eye } from 'lucide-react';

const mockHistory = [
  { id: 'INV-102934', user: 'USR-001 (Budi)', total: 152000, status: 'Sukses', date: '2026-05-23 10:42', method: 'SmartBank Pay' },
  { id: 'INV-102933', user: 'USR-045 (Siti)', total: 45500, status: 'Sukses', date: '2026-05-23 09:15', method: 'Cash' },
  { id: 'INV-102932', user: 'USR-012 (Andi)', total: 210000, status: 'Pending', date: '2026-05-22 18:05', method: 'Transfer' },
  { id: 'INV-102931', user: 'USR-088 (Dina)', total: 75000, status: 'Sukses', date: '2026-05-22 15:30', method: 'SmartBank Pay' },
  { id: 'INV-102930', user: 'USR-003 (Rudi)', total: 320000, status: 'Gagal', date: '2026-05-22 14:20', method: 'Card' },
  { id: 'INV-102929', user: 'USR-022 (Nina)', total: 125000, status: 'Sukses', date: '2026-05-21 11:10', method: 'SmartBank Pay' },
  { id: 'INV-102928', user: 'USR-019 (Eko)', total: 88000, status: 'Sukses', date: '2026-05-21 09:45', method: 'Cash' },
];

const RiwayatTransaksi = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-gray-500 text-sm mt-1">Lacak dan kelola semua transaksi kasir.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={18} />
          <span className="text-sm font-medium">Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari invoice atau user..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <span>Hari Ini</span>
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">No. Invoice</th>
                <th className="p-4 font-medium">Pelanggan</th>
                <th className="p-4 font-medium">Tanggal</th>
                <th className="p-4 font-medium">Metode</th>
                <th className="p-4 font-medium text-right">Total</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockHistory.map((trx, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-blue-600 cursor-pointer hover:underline">{trx.id}</span>
                  </td>
                  <td className="p-4 text-gray-700 font-medium">{trx.user}</td>
                  <td className="p-4 text-gray-500 text-sm">{trx.date}</td>
                  <td className="p-4 text-gray-600 text-sm">{trx.method}</td>
                  <td className="p-4 text-right font-bold text-gray-800">Rp {trx.total.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                      ${trx.status === 'Sukses' ? 'bg-green-100 text-green-700' : 
                        trx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'}
                    `}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>Menampilkan 1 - 7 dari 124 transaksi</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatTransaksi;
