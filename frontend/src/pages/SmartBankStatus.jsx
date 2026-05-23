import { useState, useEffect } from 'react';
import { Server, Activity, Clock, Shield, CheckCircle, XCircle } from 'lucide-react';

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">SmartBank Gateway Status</h1>
        <p className="text-gray-500 text-sm mt-1">Pantau konektivitas dan kesehatan API SmartBank real-time.</p>
      </div>

      {/* Hero Status Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-gray-50 opacity-50">
          <Server size={250} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            {status === 'checking' ? (
              <div className="w-32 h-32 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin flex items-center justify-center">
                <Activity className="text-blue-500 animate-pulse" size={40} />
              </div>
            ) : status === 'online' ? (
              <div className="w-32 h-32 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-500" size={50} />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center">
                <XCircle className="text-red-500" size={50} />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-800">
                {status === 'checking' ? 'Memeriksa Koneksi...' : status === 'online' ? 'Gateway Online' : 'Gateway Offline'}
              </h2>
              {status === 'online' && (
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
              )}
            </div>
            <p className="text-gray-500">Sistem terhubung dengan baik ke SmartBank Core API. Semua transaksi dapat diproses.</p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-gray-50 rounded-xl p-4 min-w-[140px]">
                <p className="text-sm text-gray-500 mb-1">Latency</p>
                <p className="text-xl font-bold text-gray-800">24 <span className="text-sm font-medium text-gray-500">ms</span></p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 min-w-[140px]">
                <p className="text-sm text-gray-500 mb-1">Uptime</p>
                <p className="text-xl font-bold text-gray-800">99.98<span className="text-sm font-medium text-gray-500">%</span></p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 min-w-[140px]">
                <p className="text-sm text-gray-500 mb-1">Last Sync</p>
                <p className="text-xl font-bold text-gray-800">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Status List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Endpoint Status</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { name: 'POST /pos/pay', desc: 'Memproses pembayaran', status: 'Operational', time: '12ms' },
            { name: 'GET /pos/verify', desc: 'Verifikasi status transaksi', status: 'Operational', time: '18ms' },
            { name: 'GET /bank/balance', desc: 'Cek saldo rekening pooling', status: 'Operational', time: '45ms' },
            { name: 'POST /bank/settlement', desc: 'Settlement akhir hari', status: 'Operational', time: '120ms' },
          ].map((endpoint, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Shield size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 font-mono text-sm">{endpoint.name}</p>
                  <p className="text-sm text-gray-500">{endpoint.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">{endpoint.time}</span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {endpoint.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartBankStatus;
