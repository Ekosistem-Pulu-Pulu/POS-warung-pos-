import { useState, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 8,
    scale: 0.995,
    filter: 'blur(4px)'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] // Linear-like ease out
    }
  },
  exit: { 
    opacity: 0,
    y: -4,
    scale: 0.995,
    filter: 'blur(2px)',
    transition: {
      duration: 0.2,
      ease: [0.2, 0, 1, 0.9]
    }
  }
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isPresentationMode } = useContext(WorkspaceContext);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`
        flex-1 flex flex-col min-w-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isPresentationMode ? 'lg:ml-0' : 'lg:ml-[260px]'}
      `}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              <div className={`mx-auto h-full ${isPresentationMode ? 'max-w-full' : 'max-w-7xl'}`}>
                <Outlet />
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
