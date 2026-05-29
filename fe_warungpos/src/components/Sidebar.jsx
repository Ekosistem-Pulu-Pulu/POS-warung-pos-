import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Receipt, 
  History, 
  Banknote, 
  PieChart, 
  CreditCard,
  Building,
  Users,
  MonitorPlay,
  X,
  LogOut,
  ChevronRight,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const { isPresentationMode } = useContext(WorkspaceContext);
  const role = user?.role || 'kasir';

  const isSidebarVisible = isPresentationMode ? isOpen : true;

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['owner', 'kasir', 'gudang'] },
    { path: '/transaksi/input', name: 'Kasir', icon: ShoppingCart, roles: ['owner', 'kasir'] },
    { path: '/transaksi/tagihan', name: 'Tagihan', icon: Receipt, roles: ['owner', 'kasir'] },
    { path: '/transaksi/riwayat', name: 'Riwayat', icon: History, roles: ['owner', 'kasir'] },
    { path: '/transaksi/payment-request', name: 'Payment Req', icon: CreditCard, roles: ['owner', 'kasir'] },
    { path: '/biaya-layanan', name: 'Biaya POS', icon: Banknote, roles: ['owner', 'kasir', 'gudang'] },
    { path: '/smartbank-status', name: 'SmartBank', icon: Building, roles: ['owner'] },
    { path: '/analytics', name: 'Analytics', icon: PieChart, roles: ['owner'] },
    { path: '/user-management', name: 'Staf', icon: Users, roles: ['owner'] },
    { path: '/subscription', name: 'Langganan', icon: Crown, roles: ['owner', 'kasir', 'gudang'] },
  ].filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        w-[260px] flex flex-col shadow-sm
        ${isOpen || (!isPresentationMode && isSidebarVisible) ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
        ${isPresentationMode && !isOpen ? 'lg:-translate-x-full' : ''}
      `}>
        
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShoppingCart className="text-white" size={16} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Warung<span className="text-blue-600">POS</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3 custom-scrollbar">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">Menu Utama</div>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => { if(window.innerWidth < 1024) setIsOpen(false); }}
                    className={({ isActive }) => `
                      group relative flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors duration-200
                      ${isActive 
                        ? 'text-blue-700 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Background Animation */}
                        {isActive && (
                          <motion.div 
                            layoutId="sidebar-bg"
                            className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-xl"
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                          />
                        )}
                        <div className="flex items-center gap-3 relative z-10">
                          <Icon 
                            size={18} 
                            className={`transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} 
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                          <span>{item.name}</span>
                        </div>
                        {/* Active Accent Dot */}
                        {isActive && (
                          <motion.div 
                            layoutId="sidebar-dot" 
                            className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 relative z-10"
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* Quick Action */}
          {['owner', 'kasir'].includes(role) && (
            <div className="mt-8 px-3">
              <a 
                href="/customer" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between w-full p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-colors">
                    <MonitorPlay size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">Layar Pelanggan</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </a>
            </div>
          )}
        </div>
        
        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 group cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); logout(); }}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
