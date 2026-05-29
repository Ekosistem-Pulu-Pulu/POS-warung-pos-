import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentRequest = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [status, setStatus] = useState('processing'); // processing, success, failed

  useEffect(() => {
    const data = localStorage.getItem('paymentPayload');
    if (data) {
      setPaymentData(JSON.parse(data));
      simulatePayment();
    } else {
      navigate('/transaksi/input');
    }
  }, [navigate]);

  const simulatePayment = () => {
    setTimeout(() => {
      // 80% chance of success for demo purposes
      const isSuccess = Math.random() > 0.2;
      setStatus(isSuccess ? 'success' : 'failed');
      
      if (isSuccess) {
        localStorage.removeItem('currentTransaction');
        
        // Broadcast paid status to customer display
        const liveCartStr = localStorage.getItem('pos_live_cart');
        if (liveCartStr) {
          try {
            const liveCart = JSON.parse(liveCartStr);
            liveCart.status = 'paid';
            localStorage.setItem('pos_live_cart', JSON.stringify(liveCart));
            window.dispatchEvent(new Event('local-storage-update'));
          } catch (e) {
            console.error('Failed to update live cart on success', e);
          }
        }
        
        localStorage.removeItem('paymentPayload');
      }
    }, 3000);
  };

  if (!paymentData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto mt-10 p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center relative overflow-hidden transition-colors duration-300">
        
        {/* Background Decorative */}
        <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500
          ${status === 'processing' ? 'bg-blue-500 animate-pulse' : 
            status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}
        `} />

        <div className="mb-6 flex justify-center">
          <AnimatePresence mode="wait">
            {status === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full border-4 border-blue-50 dark:border-blue-900/30 border-t-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="text-blue-500 animate-spin" size={32} />
                </div>
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" size={48} />
              </motion.div>
            )}
            {status === 'failed' && (
              <motion.div 
                key="failed"
                initial={{ scale: 0.5, opacity: 0, x: -10 }} animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="w-24 h-24 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-shake"
              >
                <XCircle className="text-red-500 dark:text-red-400" size={48} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {status === 'processing' ? 'Memproses Pembayaran...' : 
           status === 'success' ? 'Pembayaran Berhasil!' : 
           'Pembayaran Gagal'}
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
          {status === 'processing' ? 'Menunggu konfirmasi dari SmartBank API Gateway.' : 
           status === 'success' ? 'Transaksi telah berhasil diproses melalui SmartBank.' : 
           'Terjadi kesalahan saat memproses pembayaran atau saldo tidak cukup.'}
        </p>

        <motion.div 
          layout
          className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-left mb-8 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Invoice</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{paymentData.invoice}</span>
          </div>
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Customer</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{paymentData.userId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-300 font-bold">Total Dibayar</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">Rp {paymentData.totalPembayaran.toLocaleString('id-ID')}</span>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4">
          {status === 'processing' ? (
             <div className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl cursor-not-allowed border border-transparent">
               Harap Tunggu...
             </div>
          ) : status === 'success' ? (
            <>
              <button 
                onClick={() => navigate('/transaksi/input')}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Transaksi Baru
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 active:scale-95"
              >
                <Home size={18} />
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStatus('processing') || simulatePayment()}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Coba Lagi
              </button>
              <button 
                onClick={() => navigate('/transaksi/tagihan')}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95"
              >
                Kembali ke Tagihan
              </button>
            </>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}} />
    </motion.div>
  );
};

export default PaymentRequest;
