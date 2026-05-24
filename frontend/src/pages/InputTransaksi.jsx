import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ShoppingCart, Calculator, Receipt, PackageSearch } from 'lucide-react';
import api from '../services/api';

const InputTransaksi = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Cart items
  const [products, setProducts] = useState([]); // Products from API
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  // Masih butuh userID untuk dikirim ke backend, kita pakai dummy dulu atau input text kecil
  const [userId, setUserId] = useState('USR-001');

  // Ambil daftar produk dari backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/pos/produk');
        setProducts(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    const existingItem = items.find(item => item.itemId === product.id);
    
    if (existingItem) {
      // Jika barang sudah ada, tambah quantity
      setItems(items.map(item => 
        item.itemId === product.id 
          ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.harga }
          : item
      ));
    } else {
      // Jika barang baru, masukkan ke keranjang
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
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const feePos = subtotal * 0.01;
  const pajakSistem = subtotal * 0.02;
  const totalAkhir = subtotal + feePos + pajakSistem;

  // Broadcast to Customer Display
  useEffect(() => {
    if (items.length > 0) {
      const liveCart = {
        status: 'active',
        userId: userId,
        timestamp: new Date().toISOString(),
        items,
        subtotal,
        feePos,
        pajakSistem,
        totalAkhir
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
    
    const transactionData = {
      userId: userId,
      items,
      subtotal,
      feePos,
      pajakSistem,
      totalAkhir,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('currentTransaction', JSON.stringify(transactionData));
    
    const liveCart = {
      status: 'generated',
      userId: userId,
      timestamp: new Date().toISOString(),
      items,
      subtotal,
      feePos,
      pajakSistem,
      totalAkhir
    };
    localStorage.setItem('pos_live_cart', JSON.stringify(liveCart));
    window.dispatchEvent(new Event('local-storage-update'));

    navigate('/transaksi/tagihan');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Input Transaksi</h1>
          <p className="text-gray-500 text-sm mt-1">Pilih barang untuk dimasukkan ke keranjang kasir.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600">ID Customer:</label>
          <input 
            type="text" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none w-32"
            placeholder="USR-001"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* Kiri: Katalog Produk */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[500px]">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PackageSearch size={20} className="text-blue-600" />
            Katalog Barang
          </h2>
          
          {isLoadingProducts ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              Memuat data barang...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-gray-50 border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 p-4 rounded-xl text-left transition-all group flex flex-col h-full active:scale-95"
                >
                  <div className="font-semibold text-gray-800 group-hover:text-blue-700 leading-tight mb-2">
                    {product.name}
                  </div>
                  <div className="mt-auto font-bold text-blue-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Kanan: Keranjang Belanja */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-[500px]">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-blue-600" />
              Keranjang Belanja
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
              {items.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm mt-20">
                  Keranjang kosong. Klik barang di sebelah kiri.
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.namaBarang}</p>
                        <p className="text-xs text-gray-500">Rp {item.harga.toLocaleString('id-ID')} x {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800 text-sm">
                          Rp {item.total.toLocaleString('id-ID')}
                        </span>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Section */}
            {items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Fee POS (1%)</span>
                  <span>Rp {feePos.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Pajak (2%)</span>
                  <span>Rp {pajakSistem.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-500">Total</span>
                  <span className="text-2xl font-black text-blue-600">Rp {totalAkhir.toLocaleString('id-ID')}</span>
                </div>

                <button 
                  onClick={handleGenerateTagihan}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
                >
                  <Receipt size={20} />
                  Proses Tagihan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputTransaksi;
