import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cek status login saat aplikasi pertama kali dimuat
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Ambil profil user untuk memastikan token valid
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Gagal verifikasi token:", error);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Fungsi untuk login yang bisa dipanggil dari Login.jsx
  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    
    // Simpan token & user
    const token = res.data.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
    
    // Update state
    setUser(res.data.data.user);
    setIsAuthenticated(true);
    
    return res.data;
  };

  // Fungsi logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
