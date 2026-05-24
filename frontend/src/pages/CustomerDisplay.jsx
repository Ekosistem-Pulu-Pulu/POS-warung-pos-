import { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

const CustomerDisplay = () => {
  const [time, setTime] = useState(new Date());
  const [cartState, setCartState] = useState({
    status: 'idle', // idle, active, generated, paid
    items: [],
    subtotal: 0,
    feePos: 0,
    pajakSistem: 0,
    totalAkhir: 0
  });

  // Jam Digital
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to LocalStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const liveCart = localStorage.getItem('pos_live_cart');
      if (liveCart) {
        try {
          const parsed = JSON.parse(liveCart);
          setCartState(parsed);
          
          // Auto-reset to idle after 5 seconds if status is 'paid'
          if (parsed.status === 'paid') {
            setTimeout(() => {
              localStorage.removeItem('pos_live_cart');
              setCartState({ status: 'idle', items: [], subtotal: 0, feePos: 0, pajakSistem: 0, totalAkhir: 0 });
            }, 5000);
          }
        } catch (e) {
          console.error("Gagal membaca pos_live_cart", e);
        }
      } else {
        setCartState({ status: 'idle', items: [], subtotal: 0, feePos: 0, pajakSistem: 0, totalAkhir: 0 });
      }
    };

    // Initial load
    handleStorageChange();

    // Event listener untuk perubahan storage dari tab lain
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener jika trigger terjadi di window yang sama (bukan best practice untuk dual screen, tapi bagus untuk testing)
    window.addEventListener('local-storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(date).replace(/\./g, ':');
  };

  if (cartState.status === 'idle') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-100 p-8">
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-900/50">
            <ShoppingCart size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Selamat Datang di</h1>
          <h2 className="text-5xl font-extrabold text-blue-400 mb-16">WarungPOS</h2>
          
          <div className="text-center bg-slate-800/50 px-12 py-8 rounded-3xl border border-slate-700 backdrop-blur-sm">
            <div className="text-7xl font-mono font-bold tracking-widest text-slate-100 mb-4 drop-shadow-lg">
              {formatTime(time)}
            </div>
            <div className="text-2xl text-slate-400 font-medium">
              {formatDate(time)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartState.status === 'paid') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-100 p-8">
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-2xl shadow-green-500/40">
            <CheckCircle2 size={72} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-green-400">Pembayaran Berhasil!</h1>
          
          <div className="text-2xl text-slate-300 mb-2">Total Transaksi</div>
          <div className="text-6xl font-bold text-white mb-12">
            Rp {cartState.totalAkhir.toLocaleString('id-ID')}
          </div>

          <p className="text-3xl font-medium text-slate-300 mb-4">Terima kasih telah berbelanja! 🙏</p>
          <p className="text-xl text-slate-500">Sampai jumpa kembali</p>
        </div>
      </div>
    );
  }

  // Active / Generated State
  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
      {/* Left Area: List Item */}
      <div className="flex-1 flex flex-col p-8 border-r border-slate-800">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl"><ShoppingCart size={24} /></div>
              WarungPOS
            </h1>
          </div>
          <div className="text-2xl font-mono font-medium text-slate-400">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          <div className="space-y-4">
            {cartState.items.map((item, idx) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-800/40 p-5 rounded-2xl animate-in slide-in-from-right-4 duration-300 border border-slate-700/50">
                <div className="flex gap-6 items-center">
                  <div className="text-xl font-bold text-slate-500 w-8">{idx + 1}</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-100">{item.namaBarang}</h3>
                    <p className="text-lg text-slate-400">Rp {item.harga.toLocaleString('id-ID')} <span className="text-slate-500 mx-2">x</span> <span className="text-blue-400 font-bold">{item.qty}</span></p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-100">
                  Rp {item.total.toLocaleString('id-ID')}
                </div>
              </div>
            ))}
            
            {cartState.items.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-500 text-2xl mt-32">
                Belum ada barang
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Area: Summary */}
      <div className="w-[450px] bg-slate-800/20 p-8 flex flex-col justify-end">
        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center text-2xl text-slate-400">
            <span>Subtotal</span>
            <span className="font-medium text-slate-200">Rp {cartState.subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center text-xl text-slate-500">
            <span>Biaya Layanan (1%)</span>
            <span>Rp {cartState.feePos.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center text-xl text-slate-500">
            <span>Pajak (2%)</span>
            <span>Rp {cartState.pajakSistem.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
          {cartState.status === 'generated' && (
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
          )}
          <h3 className="text-xl text-slate-400 uppercase tracking-widest font-bold mb-2">TOTAL PEMBAYARAN</h3>
          <div className="text-6xl font-extrabold text-blue-400 tracking-tight leading-none mb-6">
            Rp {cartState.totalAkhir.toLocaleString('id-ID')}
          </div>
          
          {cartState.status === 'generated' && (
            <div className="bg-blue-500/20 text-blue-300 p-4 rounded-xl text-center font-medium border border-blue-500/30 animate-pulse">
              Menunggu konfirmasi pembayaran...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplay;
