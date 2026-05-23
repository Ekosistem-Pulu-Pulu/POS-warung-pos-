import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home } from 'lucide-react';

const PaymentRequest = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [status, setStatus] = useState('processing'); // processing, success, failed

  useEffect(() => {
    const data = localStorage.getItem('paymentPayload');
    if (data) {
      setPaymentData(JSON.parse(data));
      // Simulate payment processing via Gateway API
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
      
      // Clear data if success
      if (isSuccess) {
        localStorage.removeItem('currentTransaction');
        localStorage.removeItem('paymentPayload');
      }
    }, 3000);
  };

  if (!paymentData) return null;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg text-center relative overflow-hidden">
        
        {/* Background Decorative */}
        <div className={`absolute top-0 left-0 w-full h-2 
          ${status === 'processing' ? 'bg-blue-500 animate-pulse' : 
            status === 'success' ? 'bg-green-500' : 'bg-red-500'}
        `} />

        <div className="mb-6 flex justify-center">
          {status === 'processing' && (
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-blue-50 border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="text-blue-500 animate-spin" size={32} />
              </div>
            </div>
          )}
          {status === 'success' && (
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce-short">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
          )}
          {status === 'failed' && (
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center animate-shake">
              <XCircle className="text-red-500" size={48} />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {status === 'processing' ? 'Memproses Pembayaran...' : 
           status === 'success' ? 'Pembayaran Berhasil!' : 
           'Pembayaran Gagal'}
        </h2>
        
        <p className="text-gray-500 mb-8">
          {status === 'processing' ? 'Menunggu konfirmasi dari SmartBank API Gateway' : 
           status === 'success' ? 'Transaksi telah berhasil diproses melalui SmartBank' : 
           'Terjadi kesalahan saat memproses pembayaran atau saldo tidak cukup.'}
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-gray-500 text-sm">Invoice</span>
            <span className="font-semibold text-gray-800">{paymentData.invoice}</span>
          </div>
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-gray-500 text-sm">Customer</span>
            <span className="font-semibold text-gray-800">{paymentData.userId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Dibayar</span>
            <span className="text-xl font-bold text-blue-600">Rp {paymentData.totalPembayaran.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="flex gap-4">
          {status === 'processing' ? (
             <div className="w-full py-3 bg-gray-100 text-gray-400 font-medium rounded-xl cursor-not-allowed">
               Harap Tunggu...
             </div>
          ) : status === 'success' ? (
            <>
              <button 
                onClick={() => navigate('/transaksi/input')}
                className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Transaksi Baru
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
              >
                <Home size={18} />
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStatus('processing') || simulatePayment()}
                className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Coba Lagi
              </button>
              <button 
                onClick={() => navigate('/transaksi/tagihan')}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Kembali ke Tagihan
              </button>
            </>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15%); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s ease-in-out 1;
        }
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
    </div>
  );
};

export default PaymentRequest;
