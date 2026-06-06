import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Home, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { AuthContext } from '../context/AuthContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { activeOutlet } = useContext(WorkspaceContext);
  const { user } = useContext(AuthContext);
  
  const storeName = user?.store_name || activeOutlet || 'WarungPOS';
  const storeAddress = user?.store_address || 'Sistem Kasir Digital';
  const [paymentData] = useState(() => {
    const data = sessionStorage.getItem('paymentPayload');
    return data ? JSON.parse(data) : null;
  });
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (!paymentData) {
      navigate('/transaksi/input');
      return;
    }

    if (status !== 'processing') return;

    const timer = setTimeout(() => {
      setStatus('success');

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
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, paymentData, status]);

  const handlePrint = () => {
    setShowReceipt(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const formatDate = (dateStr) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  };

  if (!paymentData) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold">
            Data pembayaran tidak ditemukan
          </h2>
          <p className="mt-2 text-slate-500">
            Silakan kembali ke halaman transaksi.
          </p>
          <button
            onClick={() => navigate('/transaksi/input')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Kembali ke Kasir
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ===== PRINT-ONLY RECEIPT (Hidden on screen, visible on print) ===== */}
      <div id="receipt-print" className="receipt-print-area">
        <div style={{ width: '280px', fontFamily: "'Courier New', monospace", fontSize: '12px', padding: '8px', color: '#000' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>{storeName}</div>
            <div style={{ fontSize: '10px', marginTop: '2px', whiteSpace: 'pre-wrap' }}>{storeAddress}</div>
            <div style={{ fontSize: '10px', marginTop: '4px' }}>{formatDate(paymentData.timestamp)}</div>
          </div>

          {/* Invoice Info */}
          <div style={{ borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>No. Invoice:</span>
              <span style={{ fontWeight: 'bold' }}>{paymentData.invoice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Customer:</span>
              <span>{paymentData.userId}</span>
            </div>
          </div>

          {/* Items */}
          {paymentData.items && paymentData.items.length > 0 && (
            <div style={{ borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
              {paymentData.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '4px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{item.namaBarang}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span>{item.qty} x Rp {item.harga?.toLocaleString('id-ID')}</span>
                    <span>Rp {item.total?.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fee Breakdown */}
          <div style={{ borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>Rp {(paymentData.subtotal || 0).toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>Fee POS (1%)</span>
              <span>Rp {(paymentData.feePos || 0).toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>Fee Gateway (0.5%)</span>
              <span>Rp {(paymentData.feeGateway || 0).toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>Fee Bank (1%)</span>
              <span>Rp {(paymentData.feeBank || 0).toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>Pajak (2%)</span>
              <span>Rp {(paymentData.pajakSistem || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Total */}
          <div style={{ textAlign: 'center', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px dashed #000' }}>
            <div style={{ fontSize: '11px', marginBottom: '2px' }}>TOTAL PEMBAYARAN</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Rp {(paymentData.totalPembayaran || 0).toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '11px', marginTop: '4px', fontWeight: 'bold', padding: '4px', background: '#f0f0f0', borderRadius: '4px' }}>
              ✓ LUNAS — SmartBank
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#666' }}>
            <div>Terima kasih telah berbelanja!</div>
            <div style={{ marginTop: '4px', fontSize: '9px' }}>POS by WarungPOS</div>
            <div style={{ marginTop: '8px', fontSize: '9px', color: '#999' }}>--- Simpan struk ini sebagai bukti ---</div>
          </div>
        </div>
      </div>

      {/* ===== SCREEN UI ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl mx-auto mt-10 p-4 no-print"
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
              <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">Rp {(paymentData.totalPembayaran || 0).toLocaleString('id-ID')}</span>
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
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 active:scale-95 flex justify-center items-center gap-2"
                >
                  <Printer size={18} />
                  Cetak Struk
                </button>
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
                  onClick={() => setStatus('processing')}
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

        {/* Receipt Preview Modal */}
        <AnimatePresence>
          {showReceipt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center no-print"
              onClick={() => setShowReceipt(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Preview Struk</h3>
                
                {/* Receipt Preview (mini version) */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4 font-mono text-xs text-slate-800 border border-slate-200 max-h-96 overflow-y-auto">
                  <div className="text-center border-b border-dashed border-slate-300 pb-2 mb-2">
                    <div className="text-base font-bold tracking-widest">{storeName}</div>
                    <div className="text-[10px] text-slate-500 whitespace-pre-wrap">{storeAddress}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{formatDate(paymentData.timestamp)}</div>
                  </div>
                  <div className="border-b border-dashed border-slate-300 pb-2 mb-2">
                    <div className="flex justify-between"><span>Invoice:</span><span className="font-bold">{paymentData.invoice}</span></div>
                    <div className="flex justify-between"><span>Customer:</span><span>{paymentData.userId}</span></div>
                  </div>
                  {paymentData.items?.map((item, idx) => (
                    <div key={idx} className="mb-1">
                      <div className="font-bold">{item.namaBarang}</div>
                      <div className="flex justify-between text-slate-600">
                        <span>{item.qty} x Rp {item.harga?.toLocaleString('id-ID')}</span>
                        <span>Rp {item.total?.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-slate-300 pt-2 mt-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>Rp {(paymentData.subtotal || 0).toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Fee POS</span><span>Rp {(paymentData.feePos || 0).toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Fee Gateway</span><span>Rp {(paymentData.feeGateway || 0).toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Fee Bank</span><span>Rp {(paymentData.feeBank || 0).toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Pajak</span><span>Rp {(paymentData.pajakSistem || 0).toLocaleString('id-ID')}</span></div>
                  </div>
                  <div className="border-t border-dashed border-slate-300 pt-2 mt-2 text-center">
                    <div className="text-[10px]">TOTAL PEMBAYARAN</div>
                    <div className="text-lg font-bold">Rp {(paymentData.totalPembayaran || 0).toLocaleString('id-ID')}</div>
                    <div className="text-[10px] mt-1 bg-slate-200 rounded px-2 py-1 inline-block font-bold">✓ LUNAS — SmartBank</div>
                  </div>
                  <div className="text-center text-[10px] text-slate-400 mt-3">
                    <div>Terima kasih telah berbelanja!</div>
                    <div className="mt-1">POS by WarungPOS</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReceipt(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2"
                  >
                    <Printer size={16} />
                    Print
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ===== PRINT STYLES ===== */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        /* Hide receipt on screen */
        .receipt-print-area {
          display: none;
        }

        @media print {
          /* Hide everything on screen */
          body * {
            visibility: hidden !important;
          }
          
          /* Show only the receipt */
          .receipt-print-area,
          .receipt-print-area * {
            visibility: visible !important;
          }
          
          .receipt-print-area {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 280px !important;
            background: white !important;
            z-index: 99999 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Hide UI elements during print */
          .no-print {
            display: none !important;
          }

          @page {
            size: 80mm auto;
            margin: 2mm;
          }
        }
      `}} />
    </>
  );
};

export default PaymentSuccess;
