import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InputTransaksi from './pages/InputTransaksi';
import GenerateTagihan from './pages/GenerateTagihan';
import RiwayatTransaksi from './pages/RiwayatTransaksi';
import BiayaLayananPOS from './pages/BiayaLayananPOS';
import PaymentRequest from './pages/PaymentRequest';
import SmartBankStatus from './pages/SmartBankStatus';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transaksi/input" element={<InputTransaksi />} />
          <Route path="transaksi/tagihan" element={<GenerateTagihan />} />
          <Route path="transaksi/riwayat" element={<RiwayatTransaksi />} />
          <Route path="transaksi/payment-request" element={<PaymentRequest />} />
          <Route path="biaya-layanan" element={<BiayaLayananPOS />} />
          <Route path="smartbank-status" element={<SmartBankStatus />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
