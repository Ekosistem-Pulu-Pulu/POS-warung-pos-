import { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export const WorkspaceContext = createContext();

const initialChartData = (multiplier) => [
  { name: 'Sen', total: Math.floor(4000 * multiplier) },
  { name: 'Sel', total: Math.floor(3000 * multiplier) },
  { name: 'Rab', total: Math.floor(5000 * multiplier) },
  { name: 'Kam', total: Math.floor(2780 * multiplier) },
  { name: 'Jum', total: Math.floor(6890 * multiplier) },
  { name: 'Sab', total: Math.floor(8390 * multiplier) },
  { name: 'Min', total: Math.floor(10490 * multiplier) },
];

const generateMockStore = () => {
  const store = {};
  const outlets = ["Warung Pusat", "Cabang Tangerang", "Cabang Serpong", "Cabang BSD"];
  const multipliers = [1, 0.6, 0.4, 0.8];
  
  outlets.forEach((outlet, index) => {
    store[outlet] = {
      transactions: [],
      products: [],
      stats: {
        revenue: Math.floor(4520000 * multipliers[index]),
        trxCount: Math.floor(142 * multipliers[index]),
        customers: Math.floor(89 * multipliers[index]),
        uptime: 99.9,
        chartData: initialChartData(multipliers[index]),
        productsSold: {} // Format: { "Indomie": 5, "Aqua": 2 }
      }
    };
  });
  return store;
};

export const WorkspaceProvider = ({ children }) => {
  // Theme Mode
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark' || false);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Demo & Presentation Mode
  const [isDemoMode, setIsDemoMode] = useState(false);
  const toggleDemoMode = () => setIsDemoMode(!isDemoMode);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const togglePresentationMode = () => {
    if (!isPresentationMode) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
    setIsPresentationMode(!isPresentationMode);
  };

  // Multi Outlet Store
  const [activeOutlet, setActiveOutlet] = useState('Warung Pusat');
  const [globalStore, setGlobalStore] = useState(generateMockStore());

  // Helper to get active outlet data
  const demoTransactions = globalStore[activeOutlet].transactions;
  const demoProducts = globalStore[activeOutlet].products;
  const demoStats = globalStore[activeOutlet].stats;

  // Add Transaction Action
  const addTransaction = (trxData) => {
    setGlobalStore(prev => {
      const outletData = prev[activeOutlet];
      const newTrx = {
        id: `INV-${Date.now().toString().slice(-6)}`,
        user: trxData.userId,
        total: trxData.totalAkhir || trxData.totalPembayaran,
        amount: trxData.totalAkhir || trxData.totalPembayaran,
        status: 'Sukses',
        date: new Date().toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' }),
        time: new Date().toLocaleString('id-ID', { hour: '2-digit', minute:'2-digit' }),
        method: 'Cash'
      };

      // Update Analytics
      const newProductsSold = { ...outletData.stats.productsSold };
      if (trxData.items) {
        trxData.items.forEach(item => {
          newProductsSold[item.namaBarang] = (newProductsSold[item.namaBarang] || 0) + item.qty;
        });
      }

      const newChartData = [...outletData.stats.chartData];
      newChartData[6] = { ...newChartData[6], total: newChartData[6].total + Math.floor(newTrx.total / 1000) };

      return {
        ...prev,
        [activeOutlet]: {
          ...outletData,
          transactions: [newTrx, ...outletData.transactions],
          stats: {
            ...outletData.stats,
            revenue: outletData.stats.revenue + newTrx.total,
            trxCount: outletData.stats.trxCount + 1,
            customers: outletData.stats.customers + 1,
            chartData: newChartData,
            productsSold: newProductsSold
          }
        }
      };
    });
  };

  // Auto-increment logic when Demo Mode is Active
  useEffect(() => {
    let interval;
    if (isDemoMode) {
      interval = setInterval(() => {
        setGlobalStore(prev => {
          const nextStore = { ...prev };
          Object.keys(nextStore).forEach(outlet => {
            const outletData = nextStore[outlet];
            const addedRevenue = Math.floor(Math.random() * 25000) + 5000;
            const newChartData = [...outletData.stats.chartData];
            newChartData[6] = { ...newChartData[6], total: newChartData[6].total + Math.floor(addedRevenue / 1000) };

            nextStore[outlet] = {
              ...outletData,
              stats: {
                ...outletData.stats,
                revenue: outletData.stats.revenue + addedRevenue,
                trxCount: outletData.stats.trxCount + 1,
                customers: outletData.stats.customers + (Math.random() > 0.7 ? 1 : 0),
                chartData: newChartData
              }
            };
          });
          return nextStore;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isDemoMode]);

  // Generate Demo Data
  const generateDemoData = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Membangkitkan data untuk seluruh outlet...',
        success: () => {
          setGlobalStore(prev => {
            const nextStore = { ...prev };
            const productNames = ["Indomie Goreng", "Aqua 600ml", "Teh Botol", "Kapal Api", "Ultra Milk", "Taro Snack", "Beng Beng", "Roti Aoka", "Susu Beruang", "Kopiko 78"];
            const customerNames = ["Warung Maju Jaya", "Warung Bu Rina", "Toko Berkah", "Kedai Nusantara", "Warkop Agam", "Toko Sinar", "Warung Mpok", "Pak Budi", "Ibu Siti"];

            Object.keys(nextStore).forEach((outlet, index) => {
              const multiplier = index === 0 ? 1 : 0.5; // Pusat lebih besar
              
              // Products
              const generatedProducts = productNames.map((name, i) => ({
                id: i + 1,
                name: name,
                price: Math.floor(Math.random() * 10000) + 3000
              }));

              // Products Sold Analytics
              const productsSold = {};
              productNames.forEach(p => {
                productsSold[p] = Math.floor(Math.random() * 100 * multiplier);
              });

              // Transactions
              const generatedTransactions = Array.from({ length: 50 }).map((_, i) => ({
                id: `INV-${100000 + i + (index*1000)}`,
                user: customerNames[Math.floor(Math.random() * customerNames.length)],
                total: Math.floor(Math.random() * 300000) + 15000,
                amount: Math.floor(Math.random() * 300000) + 15000,
                status: Math.random() > 0.1 ? 'Sukses' : 'Pending',
                date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' }),
                time: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleString('id-ID', { hour: '2-digit', minute:'2-digit' }),
                method: ['Cash', 'Qris', 'Transfer', 'SmartBank Pay'][Math.floor(Math.random() * 4)],
              })).sort((a, b) => b.id.localeCompare(a.id));

              nextStore[outlet] = {
                products: generatedProducts,
                transactions: generatedTransactions,
                stats: {
                  ...nextStore[outlet].stats,
                  revenue: generatedTransactions.reduce((acc, curr) => acc + curr.total, 0),
                  trxCount: 50,
                  productsSold
                }
              };
            });
            return nextStore;
          });
          setIsDemoMode(true);
          return 'Data dummy di semua cabang berhasil dibangkitkan!';
        },
        error: 'Gagal generate data'
      }
    );
  };

  return (
    <WorkspaceContext.Provider value={{
      isDarkMode, toggleDarkMode,
      isDemoMode, toggleDemoMode,
      isPresentationMode, togglePresentationMode,
      activeOutlet, setActiveOutlet,
      demoProducts, demoTransactions, demoStats,
      generateDemoData, addTransaction
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
