import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, ArrowUpRight } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenue: 4000000, fee: 40000 },
  { name: 'Feb', revenue: 3000000, fee: 30000 },
  { name: 'Mar', revenue: 2000000, fee: 20000 },
  { name: 'Apr', revenue: 2780000, fee: 27800 },
  { name: 'Mei', revenue: 1890000, fee: 18900 },
  { name: 'Jun', revenue: 2390000, fee: 23900 },
  { name: 'Jul', revenue: 3490000, fee: 34900 },
];

const topProducts = [
  { name: 'Beras Premium 5kg', sales: 145, revenue: 9425000 },
  { name: 'Minyak Goreng 2L', sales: 120, revenue: 4200000 },
  { name: 'Gula Pasir 1kg', sales: 98, revenue: 1470000 },
  { name: 'Telur Ayam 1kg', sales: 85, revenue: 2380000 },
  { name: 'Mie Instan (Karton)', sales: 64, revenue: 6400000 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Laporan komprehensif performa penjualan dan pendapatan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center text-sm font-medium bg-white/20 px-2 py-1 rounded-lg">
              +14.5% <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="text-indigo-100 text-sm font-medium">Total Revenue (YTD)</p>
          <h3 className="text-3xl font-bold mt-1">Rp 124.5M</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ShoppingBag size={24} />
            </div>
            <span className="flex items-center text-sm font-medium bg-white/20 px-2 py-1 rounded-lg">
              +8.2% <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="text-blue-100 text-sm font-medium">Total Transaksi (YTD)</p>
          <h3 className="text-3xl font-bold mt-1">8,432</h3>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Users size={24} />
            </div>
            <span className="flex items-center text-sm font-medium bg-white/20 px-2 py-1 rounded-lg">
              +22.4% <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="text-emerald-100 text-sm font-medium">Pelanggan Aktif</p>
          <h3 className="text-3xl font-bold mt-1">1,204</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Pertumbuhan Pendapatan</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `Rp${val/1000000}M`} />
                <Tooltip 
                  formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Produk Terlaris</h2>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 font-medium">Nama Produk</th>
                  <th className="pb-3 font-medium text-center">Terjual</th>
                  <th className="pb-3 font-medium text-right">Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((prod, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          #{idx + 1}
                        </div>
                        <span className="font-medium text-gray-800">{prod.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-gray-600 font-medium">{prod.sales}</td>
                    <td className="py-3 text-right text-gray-800 font-bold">Rp {prod.revenue.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
