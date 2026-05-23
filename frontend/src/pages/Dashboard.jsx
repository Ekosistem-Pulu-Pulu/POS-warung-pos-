import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  CreditCard,
  Building
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const data = [
  { name: 'Sen', total: 4000 },
  { name: 'Sel', total: 3000 },
  { name: 'Rab', total: 2000 },
  { name: 'Kam', total: 2780 },
  { name: 'Jum', total: 1890 },
  { name: 'Sab', total: 2390 },
  { name: 'Min', total: 3490 },
];

const recentTransactions = [
  { id: 'INV-001', time: '10:42', amount: 150000, status: 'Sukses', method: 'Qris' },
  { id: 'INV-002', time: '11:15', amount: 45000, status: 'Sukses', method: 'Cash' },
  { id: 'INV-003', time: '12:05', amount: 210000, status: 'Pending', method: 'Transfer' },
  { id: 'INV-004', time: '13:30', amount: 75000, status: 'Sukses', method: 'Qris' },
  { id: 'INV-005', time: '14:20', amount: 320000, status: 'Gagal', method: 'Card' },
];

const StatCard = ({ title, value, icon: Icon, trend, colorClass, bgClass }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`w-12 h-12 rounded-full ${bgClass} flex items-center justify-center`}>
        <Icon className={colorClass} size={24} />
      </div>
      {trend && (
        <span className={`flex items-center text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
          <ArrowUpRight size={16} className={trend < 0 ? 'rotate-90' : ''} />
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau aktivitas toko dan transaksi hari ini.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-700">SmartBank API Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pendapatan" 
          value="Rp 4.520.000" 
          icon={DollarSign} 
          trend={12.5}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard 
          title="Total Transaksi" 
          value="142" 
          icon={ShoppingCart} 
          trend={8.2}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard 
          title="Fee POS Terkumpul" 
          value="Rp 45.200" 
          icon={TrendingUp} 
          trend={12.5}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />
        <StatCard 
          title="Active Gateway" 
          value="SmartBank" 
          icon={Building} 
          colorClass="text-orange-600"
          bgClass="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Grafik Transaksi Harian</h2>
            <select className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-blue-500 focus:border-blue-500">
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Transaksi Terakhir</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Lihat Semua</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {recentTransactions.map((trx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${trx.status === 'Sukses' ? 'bg-green-50 text-green-600' : 
                      trx.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}
                  `}>
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{trx.id}</p>
                    <p className="text-xs text-gray-500">{trx.time} • {trx.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">Rp {trx.amount.toLocaleString('id-ID')}</p>
                  <p className={`text-xs font-medium
                    ${trx.status === 'Sukses' ? 'text-green-600' : 
                      trx.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}
                  `}>
                    {trx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
