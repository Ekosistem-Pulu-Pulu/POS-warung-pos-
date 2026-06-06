import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ShoppingCart, Receipt, PackageSearch, Tag, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import { WorkspaceContext } from '../context/WorkspaceContext';

const InputTransaksi = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Cart items
  const [products, setProducts] = useState([]); // Products from API
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  const { isDemoMode, demoProducts } = useContext(WorkspaceContext);

  const generateId = () => `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
  const [userId, setUserId] = useState(generateId());

  useEffect(() => {
    const fetchProducts = async () => {
      if (isDemoMode && demoProducts && demoProducts.length > 0) {
        setProducts(demoProducts);
        setIsLoadingProducts(false);
        return;
      }
      try {
        const res = await api.get('/pos/produk');
        setProducts(res.data.data);
      } catch (err) {
        toast.error("Gagal mengambil katalog menu!");
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [isDemoMode, demoProducts]);

  const handleProductClick = (product) => {
    const existingItem = items.find(item => item.itemId === product.id);
    if (existingItem) {
      setItems(items.map(item => 
        item.itemId === product.id 
          ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.harga }
          : item
      ));
    } else {
      const newItem = {
        id: Date.now().toString(),
        itemId: product.id,
        namaBarang: product.name,
        qty: 1,
        harga: product.price,
        total: product.price
      };
      setItems([...items, newItem]);
    }
    toast.success(`${product.name} masuk ke keranjang`);
  };

  const handleRemoveItem = (item) => {
    setItems(items.filter(i => i.id !== item.id));
    toast.error(`${item.namaBarang} dihapus dari keranjang`);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const feePos = subtotal * 0.01;
  const pajakSistem = subtotal * 0.02;
  const totalAkhir = subtotal + feePos + pajakSistem;

  useEffect(() => {
    if (items.length > 0) {
      const liveCart = {
        status: 'active', userId, timestamp: new Date().toISOString(), items, subtotal, feePos, pajakSistem, totalAkhir
      };
      localStorage.setItem('pos_live_cart', JSON.stringify(liveCart));
      window.dispatchEvent(new Event('local-storage-update'));
    } else {
      localStorage.setItem('pos_live_cart', JSON.stringify({ status: 'idle', items: [], subtotal: 0, feePos: 0, pajakSistem: 0, totalAkhir: 0 }));
      window.dispatchEvent(new Event('local-storage-update'));
    }
  }, [items, userId, subtotal, feePos, pajakSistem, totalAkhir]);

  const handleGenerateTagihan = () => {
    if (items.length === 0) return;
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 800)),
      {
        loading: 'Menyusun tagihan...',
        success: () => {
          const transactionData = {
            userId, items, subtotal, feePos, pajakSistem, totalAkhir, timestamp: new Date().toISOString()
          };
          sessionStorage.setItem('currentTransaction', JSON.stringify(transactionData));
          
          const liveCart = {
            status: 'generated', userId, timestamp: new Date().toISOString(), items, subtotal, feePos, pajakSistem, totalAkhir
          };
          localStorage.setItem('pos_live_cart', JSON.stringify(liveCart));
          window.dispatchEvent(new Event('local-storage-update'));

          navigate('/transaksi/tagihan');
          return 'Tagihan berhasil dibuat!';
        },
        error: 'Gagal membuat tagihan'
      }
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Kasir POS</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-0.5">Pilih menu dan selesaikan pesanan.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 md:p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto">
          <label className="text-[11px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-2 whitespace-nowrap">ID Cust</label>
          <input 
            type="text" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1 min-w-0 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none font-bold text-sm text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Main Content: Split View Desktop, Vertical Mobile */}
      <div className="flex flex-col xl:flex-row gap-4 md:gap-6 flex-1 items-start">
        
        {/* KIRI: Katalog Produk */}
        <div className="w-full xl:w-2/3 bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <PackageSearch size={18} className="text-blue-600 dark:text-blue-400" />
              Katalog
            </h2>
            <div className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {products.length} Item
            </div>
          </div>
          
          {isLoadingProducts ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10">
              <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="font-medium text-sm">Memuat katalog...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 overflow-y-auto custom-scrollbar xl:max-h-[650px] pb-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 md:p-4 rounded-xl md:rounded-2xl text-left transition-all active:scale-[0.97] hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg flex flex-col h-28 md:h-32 overflow-hidden"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 text-xs md:text-sm leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </div>
                  <div className="mt-auto">
                    <div className="font-black text-blue-600 dark:text-blue-400 text-sm md:text-base">
                      Rp {(product.price / 1000).toFixed(0)}k
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* KANAN: Keranjang Belanja */}
        <div className="w-full xl:w-1/3 xl:sticky xl:top-24 xl:max-h-[calc(100vh-8rem)] flex flex-col">
          <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col flex-1 overflow-hidden">
            {/* Cart Header */}
            <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between shrink-0">
              <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ShoppingCart size={18} className="text-blue-600 dark:text-blue-400" />
                Keranjang
              </h2>
              {items.length > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {items.reduce((sum, i) => sum + i.qty, 0)}
                </span>
              )}
            </div>

            {/* Cart Items - Constrained height on mobile so checkout is visible */}
            <div className="overflow-y-auto bg-white dark:bg-slate-900 p-2 custom-scrollbar flex-1 max-h-[40vh] xl:max-h-none">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10 px-4 text-center">
                  <ShoppingCart size={24} className="text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="font-medium text-sm text-slate-500 mb-1">Keranjang kosong</p>
                </div>
              ) : (
                <div className="space-y-2 p-1 md:p-2">
                  {items.map((item) => (
                    <div key={item.id} className="group flex justify-between items-center bg-white dark:bg-slate-800 p-2.5 md:p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="min-w-0 flex-1 mr-2 md:mr-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-xs md:text-sm truncate">{item.namaBarang}</p>
                        <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-0.5">
                          Rp {(item.harga/1000).toFixed(0)}k <span className="text-blue-600 mx-0.5">×</span> {item.qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-slate-800 dark:text-white text-xs md:text-sm">
                          Rp {(item.total/1000).toFixed(0)}k
                        </span>
                        <button 
                          onClick={() => handleRemoveItem(item)}
                          className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary & Action */}
            <div className="p-4 md:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
              {items.length > 0 ? (
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-slate-500 text-xs md:text-sm">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-xs md:text-sm">
                    <span>Biaya & Pajak</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Rp {(feePos + pajakSistem).toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="pt-2 md:pt-3 mt-1 border-t border-slate-200 dark:border-slate-700 border-dashed flex justify-between items-end">
                    <span className="text-xs md:text-sm font-bold text-slate-500 uppercase">Total</span>
                    <span className="text-xl md:text-3xl font-black text-blue-600 dark:text-blue-400">Rp {totalAkhir.toLocaleString('id-ID')}</span>
                  </div>

                  <button 
                    onClick={handleGenerateTagihan}
                    className="w-full mt-4 md:mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-blue-600/20"
                  >
                    <Receipt size={18} />
                    Lanjut Bayar
                  </button>
                </div>
              ) : (
                <div className="pt-1 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
                  <div className="text-2xl font-black text-slate-300 dark:text-slate-700 mt-0.5">Rp 0</div>
                  <button disabled className="w-full mt-4 bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                    <Receipt size={18} /> Lanjut Bayar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputTransaksi;
