import { Bell, Search, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari transaksi..." 
            className="bg-transparent border-none outline-none text-sm w-64 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-blue-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Kasir Admin</p>
            <p className="text-xs text-gray-500">Cabang Utama</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="ml-2 text-sm text-red-600 hover:text-red-700 font-medium hidden sm:block"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
