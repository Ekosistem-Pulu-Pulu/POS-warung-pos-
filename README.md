# 🏪 WarungPOS

WarungPOS adalah aplikasi Point of Sale (POS) berbasis web yang dirancang untuk membantu pemilik warung, UMKM, dan toko kecil dalam mengelola transaksi penjualan, stok barang, pelanggan, serta laporan penjualan secara digital.

Sistem ini dibangun menggunakan arsitektur Frontend dan Backend yang terpisah agar lebih mudah dikembangkan, dipelihara, dan dikolaborasikan oleh tim pengembang.

---

# 📋 Fitur Utama

- Manajemen Produk
- Manajemen Stok Barang
- Transaksi Penjualan
- Riwayat Transaksi
- Dashboard Monitoring
- Manajemen Pengguna
- Laporan Penjualan
- Sistem Autentikasi Login
- Integrasi API Backend
- Responsive User Interface

---

# 🏗️ Arsitektur Sistem

Proyek WarungPOS terdiri dari dua bagian utama:

```text
WarungPOS
│
├── fe_warungpos/
│   └── Frontend React + Vite
│
└── be_warungpos/
    └── Backend Golang Fiber
```

---

# 🎨 Frontend (fe_warungpos)

Frontend berfungsi sebagai antarmuka pengguna (User Interface) yang digunakan oleh admin, kasir, maupun pemilik usaha untuk berinteraksi dengan sistem.

## Fungsi Frontend

- Menampilkan Dashboard
- Menampilkan Data Produk
- Menampilkan Data Inventori
- Menampilkan Riwayat Transaksi
- Menampilkan Laporan
- Mengelola Data Pengguna
- Menghubungkan pengguna dengan API Backend

## Teknologi yang Digunakan

- React JS
- Vite
- Ant Design
- Axios
- Framer Motion
- React Router DOM

## Struktur Folder Frontend

```text
src/
│
├── assets/
├── components/
├── context/
├── hooks/
├── layouts/
├── pages/
├── services/
├── utils/
└── App.jsx
```

### Penjelasan Folder

| Folder | Fungsi |
|----------|----------|
| assets | Menyimpan gambar, icon, dan file statis |
| components | Komponen UI yang dapat digunakan ulang |
| context | State management menggunakan React Context |
| hooks | Custom React Hooks |
| layouts | Layout utama aplikasi |
| pages | Halaman-halaman aplikasi |
| services | Komunikasi API dengan Backend |
| utils | Fungsi-fungsi bantuan |

---

# ⚙️ Backend (be_warungpos)

Backend berfungsi sebagai pusat pengolahan data dan penyedia API yang digunakan oleh frontend.

## Fungsi Backend

- Mengelola Data Produk
- Mengelola Data Inventori
- Mengelola Data Pengguna
- Mengelola Data Pelanggan
- Mengelola Data Transaksi
- Mengelola Laporan
- Menyediakan REST API
- Menangani Autentikasi dan Otorisasi

## Teknologi yang Digunakan

- Golang
- Fiber Framework
- PostgreSQL
- GORM
- JWT Authentication

## Struktur Folder Backend

```text
backend/
│
├── handlers/
├── middleware/
├── models/
├── routes/
├── services/
├── repositories/
├── config/
└── main.go
```

### Penjelasan Folder

| Folder | Fungsi |
|----------|----------|
| handlers | Menangani request dan response API |
| middleware | Middleware autentikasi dan validasi |
| models | Struktur data dan entity database |
| routes | Routing endpoint API |
| services | Business logic aplikasi |
| repositories | Akses data ke database |
| config | Konfigurasi aplikasi |

---

# 🔄 Alur Sistem

```text
Frontend (React)
        │
        ▼
REST API (Fiber)
        │
        ▼
PostgreSQL Database
```

1. Pengguna melakukan aksi pada frontend.
2. Frontend mengirim request ke backend melalui API.
3. Backend memproses data dan berinteraksi dengan database.
4. Backend mengirim response kembali ke frontend.
5. Frontend menampilkan hasil kepada pengguna.

---

# 🚀 Cara Menjalankan Frontend

```bash
cd fe_warungpos
npm install
npm run dev
```

Aplikasi frontend akan berjalan pada:

```text
http://localhost:5173
```

---

# 🚀 Cara Menjalankan Backend

```bash
cd be_warungpos
go mod tidy
go run main.go
```

API backend akan berjalan pada:

```text
http://localhost:3000
```

atau sesuai konfigurasi yang digunakan.

---

# 🗄️ Database

Database yang digunakan adalah PostgreSQL.

Pastikan konfigurasi database telah disesuaikan pada file environment sebelum menjalankan backend.

Contoh konfigurasi:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=warungpos
```

---

# 👥 Tim Pengembang

Proyek ini dikembangkan sebagai bagian dari tugas akademik dan pembelajaran pengembangan perangkat lunak berbasis web menggunakan React dan Golang.

---

# 📚 Refactoring & Improvement

Perbaikan yang dilakukan pada proyek ini meliputi:

- Penyempurnaan struktur folder
- Peningkatan dokumentasi README
- Pemisahan tanggung jawab komponen
- Penerapan prinsip SOLID
- Peningkatan maintainability dan readability kode

---

# 📄 Lisensi

Proyek ini digunakan untuk kebutuhan pembelajaran, penelitian, dan pengembangan sistem informasi berbasis web.