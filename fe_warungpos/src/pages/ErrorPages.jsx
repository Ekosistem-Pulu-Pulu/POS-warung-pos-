import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Crown, Home } from 'lucide-react';

export const StoreBlockedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Toko Dinonaktifkan</h1>
        <p className="text-slate-500 mb-8">
          Akses ke toko ini telah diblokir sementara oleh Superadmin. Silakan hubungi layanan pelanggan atau administrator sistem untuk informasi lebih lanjut.
        </p>
        <button 
          onClick={() => {
            sessionStorage.clear(); localStorage.clear();
            navigate('/login');
          }}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
};

export const UpgradeRequiredPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Crown size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Fitur Premium</h1>
        <p className="text-slate-500 mb-8">
          Fitur yang Anda coba akses membutuhkan paket berlangganan yang lebih tinggi (Pro atau Enterprise). Silakan upgrade paket Anda untuk menggunakan fitur ini.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/subscription')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-purple-600/30"
          >
            Upgrade Paket Sekarang
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-slate-200">404</h1>
        <h2 className="text-3xl font-bold text-slate-800 mt-4">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-500 mt-2 mb-8">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
        >
          <Home size={18} />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </div>
  );
};
