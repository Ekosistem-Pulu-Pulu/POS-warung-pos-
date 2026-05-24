import { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AuthContext);
  const role = user?.role || 'kasir';

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['owner', 'kasir', 'gudang'] },
    { path: '/transaksi/input', name: 'Input Transaksi', icon: <ShoppingCart size={20} />, roles: ['owner', 'kasir'] },
    { path: '/transaksi/tagihan', name: 'Generate Tagihan', icon: <Receipt size={20} />, roles: ['owner', 'kasir'] },
    { path: '/transaksi/riwayat', name: 'Riwayat Transaksi', icon: <History size={20} />, roles: ['owner', 'kasir'] },
    { path: '/transaksi/payment-request', name: 'Payment Request', icon: <CreditCard size={20} />, roles: ['owner', 'kasir'] },
    { path: '/biaya-layanan', name: 'Biaya Layanan POS', icon: <Banknote size={20} />, roles: ['owner', 'kasir', 'gudang'] },
    { path: '/smartbank-status', name: 'SmartBank Status', icon: <Building size={20} />, roles: ['owner'] },
    { path: '/analytics', name: 'Analytics', icon: <PieChart size={20} />, roles: ['owner'] },
    { path: '/user-management', name: 'Manajemen User', icon: <Users size={20} />, roles: ['owner'] },
  ].filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen bg-white border-r border-gray-200 transition-transform duration-300
        w-64 flex flex-col shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShoppingCart className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Warung<span className="text-blue-600">POS</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <span className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Footer Area */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-3">
          {['owner', 'kasir'].includes(role) && (
            <a 
              href="/customer" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors border border-blue-100"
            >
              <MonitorPlay size={16} /> Layar Pelanggan
            </a>
          )}
          <div className="text-xs text-center text-gray-500">
            WarungPOS v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
