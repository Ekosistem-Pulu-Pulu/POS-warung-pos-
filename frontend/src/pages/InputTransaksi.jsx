import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ShoppingCart, Calculator, Receipt } from 'lucide-react';

const InputTransaksi = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    userId: 'USR-001', // Dummy default
    itemId: '',
    namaBarang: '',
    qty: 1,
    harga: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!formData.namaBarang || !formData.harga || formData.qty < 1) return;

    const newItem = {
      id: Date.now().toString(),
      itemId: formData.itemId || `ITM-${Math.floor(Math.random() * 1000)}`,
      namaBarang: formData.namaBarang,
      qty: parseInt(formData.qty),
      harga: parseFloat(formData.harga),
      total: parseInt(formData.qty) * parseFloat(formData.harga)
    };

    setItems([...items, newItem]);
    
    // Reset form mostly
    setFormData(prev => ({
      ...prev,
      itemId: '',
      namaBarang: '',
      qty: 1,
      harga: ''
    }));
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const feePos = subtotal * 0.01;
  const pajakSistem = subtotal * 0.02;
  const totalAkhir = subtotal + feePos + pajakSistem;

  const handleGenerateTagihan = () => {
    if (items.length === 0) return;
    
    // Save to local storage or state management to pass to next page
    const transactionData = {
      userId: formData.userId,
      items,
      subtotal,
      feePos,
      pajakSistem,
      totalAkhir,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('currentTransaction', JSON.stringify(transactionData));
    navigate('/transaksi/tagihan');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Input Transaksi</h1>
          <p className="text-gray-500 text-sm mt-1">Masukkan barang belanjaan pelanggan untuk checkout.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Input Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-blue-600" />
              Tambah Barang
            </h2>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID / Customer</label>
                <input 
                  type="text" 
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  placeholder="ID Pelanggan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                <input 
                  type="text" 
                  name="namaBarang"
                  value={formData.namaBarang}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  placeholder="Misal: Beras 5kg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input 
                    type="number" 
                    name="harga"
                    value={formData.harga}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                  <input 
                    type="number" 
                    name="qty"
                    value={formData.qty}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    placeholder="1"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Plus size={18} />
                Tambah ke Keranjang
              </button>
            </form>
          </div>
        </div>

        {/* Checkout Table & Summary */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator size={20} className="text-blue-600" />
              Keranjang Belanja
            </h2>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                    <th className="p-3 font-medium rounded-tl-lg">Item</th>
                    <th className="p-3 font-medium">Harga</th>
                    <th className="p-3 font-medium text-center">Qty</th>
                    <th className="p-3 font-medium text-right">Total</th>
                    <th className="p-3 font-medium text-center rounded-tr-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500 border-b border-gray-50">
                        Keranjang masih kosong. Tambahkan barang untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-3">
                          <p className="font-medium text-gray-800">{item.namaBarang}</p>
                          <p className="text-xs text-gray-500">{item.itemId}</p>
                        </td>
                        <td className="p-3 text-gray-600">Rp {item.harga.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-center text-gray-800 font-medium">{item.qty}</td>
                        <td className="p-3 text-right font-medium text-gray-800">Rp {item.total.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors inline-block"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            {items.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="w-full lg:w-1/2 ml-auto space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Fee POS (1%)</span>
                    <span className="font-medium text-gray-800">Rp {feePos.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Pajak Sistem (2%)</span>
                    <span className="font-medium text-gray-800">Rp {pajakSistem.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total Pembayaran</span>
                    <span className="text-xl font-bold text-blue-600">Rp {totalAkhir.toLocaleString('id-ID')}</span>
                  </div>

                  <button 
                    onClick={handleGenerateTagihan}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm shadow-green-200"
                  >
                    <Receipt size={20} />
                    Generate Tagihan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputTransaksi;
