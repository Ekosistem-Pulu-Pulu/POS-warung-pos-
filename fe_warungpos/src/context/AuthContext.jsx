import React, { createContext, useState, useEffect, useRef } from 'react';
import api, { setLoginInProgress } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Guard: jika login() sudah dipanggil, initAuth tidak boleh menimpa state
  const hasManuallyLoggedIn = useRef(false);

  // Cek status login saat aplikasi pertama kali dimuat
  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          // Ambil profil user untuk memastikan token valid
          const res = await api.get('/auth/me');
          // Jika login() sudah dipanggil sementara initAuth masih berjalan, jangan timpa
          if (!hasManuallyLoggedIn.current) {
            setUser(res.data.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Gagal verifikasi token:", error);
          // Hanya bersihkan jika user belum login manual
          if (!hasManuallyLoggedIn.current) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Fungsi untuk login yang bisa dipanggil dari Login.jsx
  const login = async (identifier, password) => {
    // Aktifkan guard agar initAuth dan interceptor tidak mengganggu
    hasManuallyLoggedIn.current = true;
    setLoginInProgress(true);
    
    try {
      const res = await api.post('/auth/login', { identifier, password });
      
      // Simpan token & user
      const token = res.data.data.token;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(res.data.data.user));
      
      // Update state
      setUser(res.data.data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return res.data;
    } finally {
      // Matikan flag setelah navigasi selesai (beri delay agar context sempat update)
      setTimeout(() => {
        setLoginInProgress(false);
      }, 2000);
    }
  };

  // Fungsi logout
  const logout = () => {
    hasManuallyLoggedIn.current = false;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

