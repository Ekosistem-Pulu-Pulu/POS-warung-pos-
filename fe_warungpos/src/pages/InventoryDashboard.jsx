import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, AlertTriangle, XCircle, Search, Plus, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryDashboard = () => {
  const [stats, setStats] = useState({ total_products: 0, low_stock: 0, out_of_stock: 0 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    min_stock: '10'
  });
  
  const [restockData, setRestockData] = useState({
    qty: '',
    note: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes] = await Promise.all([
        api.get('/inventory/dashboard'),
        api.get('/inventory/products')
      ]);
      setStats(statsRes.data.data);
      setProducts(prodRes.data.data);
    } catch (err) {
      toast.error('Gagal memuat data inventaris');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRestockChange = (e) => {
    const { name, value } = e.target;
    setRestockData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/inventory/products', {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        min_stock: Number(formData.min_stock)
      });
      toast.success('Barang berhasil ditambahkan');
      setIsAddModalOpen(false);
      setFormData({ name: '', category: '', price: '', stock: '', min_stock: '10' });
      fetchData();
    } catch (err) {
      toast.error('Gagal menambahkan barang');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/inventory/products/${selectedProduct.id}`, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        min_stock: Number(formData.min_stock)
      });
      toast.success('Data barang berhasil diperbarui');
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Gagal memperbarui barang');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus barang ini? Data transaksi yang terkait mungkin akan terpengaruh.')) return;
    
    try {
      await api.delete(`/inventory/products/${id}`);
      toast.success('Barang berhasil dihapus');
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Gagal menghapus barang');
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/inventory/restock', {
        item_id: selectedProduct.id,
        qty: Number(restockData.qty),
        note: restockData.note
      });
      toast.success('Stok berhasil ditambahkan');
      setIsRestockModalOpen(false);
      setRestockData({ qty: '', note: '' });
      fetchData();
    } catch (err) {
      toast.error('Gagal menambahkan stok');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setSelectedProduct(item);
    setFormData({
      name: item.name,
      category: item.category || '',
      price: item.price,
      stock: item.stock, // stock is read-only in edit
      min_stock: item.min_stock
    });
    setIsEditModalOpen(true);
  };

  const openRestockModal = (item) => {
    setSelectedProduct(item);
    setRestockData({ qty: '', note: '' });
    setIsRestockModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && products.length === 0) {
    return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gudang Stok</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola persediaan barang dan inventaris toko Anda</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95 w-full sm:w-auto font-medium"
        >
          <Plus size={18} />
          <span>Tambah Barang</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Barang</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total_products}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stok Menipis</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.low_stock}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-xl">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stok Habis</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.out_of_stock}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">Daftar Inventaris</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari barang..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="py-3 px-6 font-medium whitespace-nowrap">Nama Barang</th>
                <th className="py-3 px-6 font-medium">Kategori</th>
                <th className="py-3 px-6 font-medium">Harga Jual</th>
                <th className="py-3 px-6 font-medium">Stok Saat Ini</th>
                <th className="py-3 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800 dark:text-white whitespace-nowrap">{item.name}</td>
                  <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{item.category || '-'}</td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300 whitespace-nowrap">Rp {item.price.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${item.stock <= item.min_stock ? (item.stock === 0 ? 'bg-red-500' : 'bg-amber-500') : 'bg-emerald-500'}`}></span>
                      <span className={`font-semibold ${item.stock <= item.min_stock ? (item.stock === 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400') : 'text-slate-700 dark:text-slate-300'}`}>
                        {item.stock}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openRestockModal(item)}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors font-medium"
                      >
                        Restock
                      </button>
                      <button 
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Barang tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Tambah Barang Baru</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Barang *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" placeholder="Cth: Indomie Goreng" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" placeholder="Cth: Makanan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Harga Jual (Rp) *</label>
                  <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" placeholder="3000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stok Awal *</label>
                    <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Batas Minimum</label>
                    <input type="number" name="min_stock" min="0" value={formData.min_stock} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" placeholder="10" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-70">
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Barang'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Edit Barang</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Barang *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Harga Jual (Rp) *</label>
                  <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stok Saat Ini</label>
                    <input type="number" value={formData.stock} disabled className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/50 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed" />
                    <p className="text-[10px] text-slate-400 mt-1">Gunakan tombol Restock</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Batas Minimum</label>
                    <input type="number" name="min_stock" min="0" value={formData.min_stock} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" />
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => handleDelete(selectedProduct.id)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors">
                    <Trash2 size={20} />
                  </button>
                  <div className="flex gap-3 flex-1">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">Batal</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-70">
                      Simpan
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Restock Modal */}
      <AnimatePresence>
        {isRestockModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Tambah Stok (Restock)</h3>
                <button onClick={() => setIsRestockModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleRestockSubmit} className="p-4 space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">{selectedProduct.name}</p>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400 mt-1">Stok saat ini: {selectedProduct.stock}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jumlah Stok Masuk *</label>
                  <input type="number" name="qty" required min="1" value={restockData.qty} onChange={handleRestockChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" placeholder="Contoh: 20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catatan Tambahan</label>
                  <input type="text" name="note" value={restockData.note} onChange={handleRestockChange} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" placeholder="Contoh: Pembelian dari Supplier A" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsRestockModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-70">
                    {isSubmitting ? 'Memproses...' : 'Tambah Stok'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InventoryDashboard;
