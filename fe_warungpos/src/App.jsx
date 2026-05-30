import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InputTransaksi from './pages/InputTransaksi';
import GenerateTagihan from './pages/GenerateTagihan';
import RiwayatTransaksi from './pages/RiwayatTransaksi';
import BiayaLayananPOS from './pages/BiayaLayananPOS';
import PaymentSuccess from './pages/PaymentSuccess';
import SmartBankStatus from './pages/SmartBankStatus';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import CustomerDisplay from './pages/CustomerDisplay';
import Subscription from './pages/Subscription';

function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <AuthProvider>
        <Router>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes (hanya bisa diakses jika sudah login) */}
            <Route element={<ProtectedRoute />}>
              {/* Fullscreen route without sidebar */}
              <Route path="/customer" element={<CustomerDisplay />} />

              {/* Routes with Sidebar Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="transaksi/input" element={<InputTransaksi />} />
                <Route path="transaksi/tagihan" element={<GenerateTagihan />} />
                <Route path="transaksi/riwayat" element={<RiwayatTransaksi />} />
                <Route path="transaksi/success" element={<PaymentSuccess />} />
                <Route path="biaya-layanan" element={<BiayaLayananPOS />} />
                <Route path="smartbank-status" element={<SmartBankStatus />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="subscription" element={<Subscription />} />
              </Route>
            </Route>
          </Routes>
        </Router>
        </AuthProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}

export default App;
