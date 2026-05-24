import { PieChart as PieChartIcon, ArrowRight, ShieldCheck, Banknote } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const dataBiaya = [
  { name: 'Fee POS (1%)', value: 450000, color: '#3b82f6' },
  { name: 'Fee Gateway (0.5%)', value: 225000, color: '#f59e0b' },
  { name: 'Fee Bank (1%)', value: 450000, color: '#10b981' },
  { name: 'Pajak Sistem (2%)', value: 900000, color: '#8b5cf6' },
];

const BiayaLayananPOS = () => {
  const totalPotongan = dataBiaya.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Biaya Layanan POS</h1>
        <p className="text-gray-500 text-sm mt-1">Rincian fee transaksi, gateway, dan pajak sistem.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Banknote size={120} />
          </div>
          <div className="relative z-10">
            <h2 className="text-blue-100 font-medium mb-1">Total Potongan Bulan Ini</h2>
            <p className="text-4xl font-bold mb-6">Rp {totalPotongan.toLocaleString('id-ID')}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <span className="flex items-center gap-2"><ShieldCheck size={16} /> Total Transaksi</span>
                <span className="font-bold">Rp 45.000.000</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <span>Estimasi Bersih</span>
                <span className="font-bold">Rp {(45000000 - totalPotongan).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart & Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-blue-600" />
            Distribusi Biaya Layanan
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataBiaya}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataBiaya.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              {dataBiaya.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700 font-medium text-sm">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-800 text-sm">Rp {item.value.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Information Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Skema Biaya per Transaksi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="p-4 font-medium">Jenis Biaya</th>
                  <th className="p-4 font-medium">Persentase</th>
                  <th className="p-4 font-medium">Penerima</th>
                  <th className="p-4 font-medium">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="p-4 font-medium text-gray-800">Fee POS</td>
                  <td className="p-4 text-blue-600 font-bold">1.0%</td>
                  <td className="p-4 text-gray-600">Sistem WarungPOS</td>
                  <td className="p-4 text-gray-500">Biaya layanan aplikasi dan maintenance</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-800">Fee Gateway</td>
                  <td className="p-4 text-orange-600 font-bold">0.5%</td>
                  <td className="p-4 text-gray-600">SmartBank API</td>
                  <td className="p-4 text-gray-500">Biaya routing dan integrasi API</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-800">Fee Bank</td>
                  <td className="p-4 text-emerald-600 font-bold">1.0%</td>
                  <td className="p-4 text-gray-600">Bank Terkait</td>
                  <td className="p-4 text-gray-500">Biaya switching antar bank / principal</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-800">Pajak Sistem</td>
                  <td className="p-4 text-purple-600 font-bold">2.0%</td>
                  <td className="p-4 text-gray-600">Pemerintah</td>
                  <td className="p-4 text-gray-500">Pajak digital PPN 11% dari total fee</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiayaLayananPOS;
