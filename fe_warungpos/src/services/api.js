import axios from 'axios';

// Buat instance axios dengan baseURL yang mengarah ke proxy (/api)
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag untuk mencegah interceptor membajak saat proses login sedang berjalan
let isLoginInProgress = false;
export const setLoginInProgress = (val) => { isLoginInProgress = val; };

// Interceptor untuk menyisipkan token ke setiap request secara otomatis
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani response error secara global
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = window.location.pathname;
      const requestUrl = error.config?.url || '';

      // Jangan redirect jika sedang dalam proses login atau request ke /auth/me
      const isAuthRequest = requestUrl.includes('/auth/me') || requestUrl.includes('/auth/login');
      
      if (status === 401 && url !== '/login' && !isLoginInProgress && !isAuthRequest) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login?session_expired=true';
      }
      
      // Jika toko di-blokir atau tidak aktif
      if (status === 403 && error.response.data?.message?.toLowerCase().includes('tidak aktif')) {
        if (!isLoginInProgress) {
          window.location.href = '/blocked';
        }
      }
      
      // Jika paket tidak cukup (Upgrade Required)
      if (status === 402 || (status === 403 && error.response.data?.message?.toLowerCase().includes('paket'))) {
        if (!isLoginInProgress) {
          window.location.href = '/upgrade';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

