import { useState, useContext, useRef, useEffect } from 'react';
import { Bell, Search, Menu, Command, Plus, Moon, Sun, ShoppingCart, Zap, Building2, Presentation, ChevronDown, Check, Package, FileText, User } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { ThemeContext } from '../context/ThemeContext';
import { SubscriptionContext } from '../context/SubscriptionContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ setIsSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const { plan } = useContext(SubscriptionContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { 
    isDemoMode, toggleDemoMode,
    isPresentationMode, togglePresentationMode,
    activeOutlet, setActiveOutlet,
    demoProducts, demoTransactions
  } = useContext(WorkspaceContext);

  const [isOutletOpen, setIsOutletOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const searchRef = useRef(null);
  const outletRef = useRef(null);
  const notifRef = useRef(null);

  const pathnames = location.pathname.split('/').filter((x) => x);
  const outlets = ["Warung Pusat", "Cabang Tangerang", "Cabang Serpong", "Cabang BSD"];

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
      if (outletRef.current && !outletRef.current.contains(event.target)) setIsOutletOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global Search Logic (Frontend Only)
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];
    
    // Search Products
    demoProducts.forEach(p => {
      if (p.name.toLowerCase().includes(q)) results.push({ type: 'product', icon: Package, title: p.name, desc: `Rp ${p.price.toLocaleString('id-ID')}` });
    });
    
    // Search Transactions
    demoTransactions.forEach(t => {
      if (t.id.toLowerCase().includes(q) || t.user.toLowerCase().includes(q)) {
        results.push({ type: 'transaction', icon: FileText, title: t.id, desc: `${t.user} - Rp ${t.total.toLocaleString('id-ID')}` });
      }
    });

    return results.slice(0, 5); // Limit 5 results
  };

  const searchResults = getSearchResults();

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0 transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 ml-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShoppingCart className="text-white" size={14} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Warung<span className="text-blue-600">POS</span></span>
        </div>
        
        {/* Breadcrumb / Page Title */}
        <div className="hidden sm:flex items-center gap-2 text-sm font-semibold">
          <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">WarungPOS</Link>
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1;
            const title = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');
            return (
              <div key={value} className="flex items-center gap-2">
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className={isLast ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>

        {/* DEMO MODE ACTIVE BADGE */}
        {isDemoMode && (
          <div className="hidden lg:flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm shadow-amber-500/20 animate-pulse">
            <Zap size={10} fill="currentColor" /> Demo Active
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Custom Outlet Selector */}
        <div className="hidden lg:block relative" ref={outletRef}>
          <button 
            onClick={() => setIsOutletOpen(!isOutletOpen)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 transition-colors group"
          >
            <Building2 size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{activeOutlet}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOutletOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOutletOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-1">
                  {outlets.map(outlet => (
                    <button
                      key={outlet}
                      onClick={() => { setActiveOutlet(outlet); setIsOutletOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <span className={activeOutlet === outlet ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}>
                        {outlet}
                      </span>
                      {activeOutlet === outlet && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Search */}
        <div className="hidden md:block relative" ref={searchRef}>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors text-slate-500 dark:text-slate-400"
          >
            <Search size={16} />
            <span className="text-sm font-medium mr-4">Cari...</span>
            <div className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
              <Command size={10} /> K
            </div>
          </button>

          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Cari produk, invoice..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 text-sm font-medium text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                  {!searchQuery ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">Ketik untuk mulai mencari...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">Tidak ada hasil ditemukan.</div>
                  ) : (
                    searchResults.map((res, idx) => {
                      const Icon = res.icon;
                      return (
                        <button key={idx} onClick={() => setIsSearchOpen(false)} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left group">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors shrink-0">
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{res.title}</p>
                            <p className="text-xs font-medium text-slate-500 truncate">{res.desc}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

        {/* Subscription Badge */}
        <Link to="/subscription" className={`hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors group
          ${plan === 'pro' || plan === 'enterprise' 
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50' 
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${plan === 'pro' || plan === 'enterprise' ? 'bg-blue-600' : 'bg-slate-500'}`}></span>
          <span className={`text-xs font-bold transition-colors ${plan === 'pro' || plan === 'enterprise' ? 'text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300'}`}>
            {plan ? plan.toUpperCase() : 'BASIC'} PLAN
          </span>
        </Link>

        {/* Presentation Toggle */}
        <button 
          onClick={togglePresentationMode}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border
            ${isPresentationMode 
              ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-800/60' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}
          `}
        >
          <Presentation size={14} />
          {isPresentationMode ? 'Exit Fullscreen' : 'Present'}
        </button>
        
        {/* Demo Mode Toggle */}
        <button 
          onClick={toggleDemoMode}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border
            ${isDemoMode 
              ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/60' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}
          `}
        >
          <Zap size={14} />
          {isDemoMode ? 'Demo On' : 'Demo'}
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors active:scale-95"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Quick Action */}
        <Link to="/transaksi/input" className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-sm font-bold transition-colors shadow-sm shadow-blue-600/20 active:scale-95">
          <Plus size={16} />
          <span className="hidden lg:inline">Transaksi</span>
        </Link>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

        {/* Notification */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors active:scale-95"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
          </button>
          
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white">Notifikasi</h3>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer">Tandai dibaca</span>
                </div>
                <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Payment Berhasil</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">INV-102934 via SmartBank Pay.</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">Baru saja</p>
                  </div>
                  <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Stok Menipis</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Indomie Goreng sisa 12 pcs.</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">2 jam lalu</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
