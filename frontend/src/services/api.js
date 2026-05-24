import axios from 'axios';

// Buat instance axios dengan baseURL yang mengarah ke proxy (/api)
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan token ke setiap request secara otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    // Jika backend merespon 401 Unauthorized (misal token expired), 
    // kita bisa melakukan redirect ke login atau hapus token.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Uncomment baris di bawah jika ingin otomatis reload ke halaman login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
