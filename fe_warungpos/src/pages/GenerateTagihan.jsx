import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, CheckCircle, ArrowRight, FileText, CreditCard } from 'lucide-react';
import { WorkspaceContext } from '../context/WorkspaceContext';
import axios from 'axios';

const GenerateTagihan = () => {
  const navigate = useNavigate();
  const [trxData, setTrxData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  
  const { addTransaction } = useContext(WorkspaceContext);

  useEffect(() => {
    const data = localStorage.getItem('currentTransaction');
    if (data) {
      setTrxData(JSON.parse(data));
      // Generate a mock invoice number
      setInvoiceNumber(`INV-${new Date().getTime().toString().slice(-6)}`);
    } else {
      // If no data, go back
      navigate('/transaksi/input');
    }
  }, [navigate]);

  if (!trxData) return null;

  // Recalculate fees for exactness based on specs
  const subtotal = trxData.subtotal;
  const feeGateway = subtotal * 0.005; // 0.5%
  const feeBank = subtotal * 0.01;    // 1%
  const feePos = subtotal * 0.01;     // 1%
  const pajakSistem = subtotal * 0.02; // 2%
  
  const totalPembayaran = subtotal + feeGateway + feeBank + feePos + pajakSistem;

  const handleKirimPaymentRequest = async () => {
    setIsProcessing(true);
    
    // Simulate API call to SmartBank Gateway
    try {
      // In real scenario: await axios.post('/pos/pay', payload)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const payload = {
        invoice: invoiceNumber,
        ...trxData,
        feeGateway,
        feeBank,
        totalPembayaran
      };
      
      localStorage.setItem('paymentPayload', JSON.stringify(payload));
      
      // Update shared frontend store (Analytics, Dashboard, Riwayat)
      addTransaction(payload);
      
      navigate('/transaksi/payment-request');
      
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim payment request');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
        <span className="flex items-center gap-1"><CheckCircle size={16} className="text-green-500" /> Input</span>
        <ArrowRight size={16} />
        <span className="text-blue-600 dark:text-blue-400 font-bold">Review & Tagihan</span>
        <ArrowRight size={16} />
        <span>Payment</span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header Invoice */}
        <div className="bg-blue-600 p-8 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={24} />
              <h1 className="text-2xl font-bold tracking-tight">Invoice Tagihan</h1>
            </div>
            <p className="text-blue-100 text-sm">WarungPOS System</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">No. Invoice</p>
            <p className="text-xl font-bold tracking-wider">{invoiceNumber}</p>
            <p className="text-xs text-blue-200 mt-2">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        {/* Body Invoice */}
        <div className="p-8">
          <div className="mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Ditagihkan Kepada:</p>
            <p className="font-semibold text-gray-800 dark:text-slate-200 text-lg">{trxData.userId}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left mb-8 min-w-[500px]">
              <thead>
                <tr className="text-gray-500 dark:text-slate-400 text-sm border-b border-gray-200 dark:border-slate-800">
                  <th className="pb-3 font-medium">Deskripsi Item</th>
                  <th className="pb-3 font-medium text-center">Qty</th>
                  <th className="pb-3 font-medium text-right">Harga</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-slate-300">
                {trxData.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 dark:border-slate-800/50">
                    <td className="py-4">
                      <p className="font-medium text-gray-800 dark:text-slate-200">{item.namaBarang}</p>
                    </td>
                    <td className="py-4 text-center">{item.qty}</td>
                    <td className="py-4 text-right">Rp {item.harga.toLocaleString('id-ID')}</td>
                    <td className="py-4 text-right font-medium">Rp {item.total.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full sm:w-2/3 lg:w-1/2 space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                <span>Subtotal Items</span>
                <span className="font-medium text-gray-800 dark:text-slate-200">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                <span>Fee POS (1%)</span>
                <span>Rp {feePos.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                <span>Fee Gateway SmartBank (0.5%)</span>
                <span>Rp {feeGateway.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                <span>Fee Bank (1%)</span>
                <span>Rp {feeBank.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                <span>Pajak Sistem (2%)</span>
                <span>Rp {pajakSistem.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700 mt-4 flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                <span className="text-gray-700 dark:text-slate-300 font-bold">Total Tagihan</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rp {totalPembayaran.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/transaksi/input')}
              className="px-6 py-3 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex-1 text-center"
            >
              Batal
            </button>
            <button 
              onClick={handleKirimPaymentRequest}
              disabled={isProcessing}
              className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex-[2] flex justify-center items-center gap-2
                ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Kirim Payment Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateTagihan;
