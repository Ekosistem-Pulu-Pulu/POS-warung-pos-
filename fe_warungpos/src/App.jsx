import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
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
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import CustomerDisplay from './pages/CustomerDisplay';
import Subscription from './pages/Subscription';
import InventoryDashboard from './pages/InventoryDashboard';
import { StoreBlockedPage, UpgradeRequiredPage, NotFoundPage } from './pages/ErrorPages';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStores from './pages/admin/AdminStores';

function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <AuthProvider>
          <SubscriptionProvider>
          <Router>
            <Toaster position="top-right" richColors />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/customer" element={<CustomerDisplay />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                
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
                  <Route path="inventory" element={<InventoryDashboard />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="stores" element={<AdminStores />} />
              </Route>

              {/* Error Routes */}
              <Route path="/blocked" element={<StoreBlockedPage />} />
              <Route path="/upgrade" element={<UpgradeRequiredPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          </SubscriptionProvider>
        </AuthProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}

export default App;
