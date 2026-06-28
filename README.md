# 🏪 Warung POS — Point of Sales untuk UMKM

<div align="center">

![Warung POS](https://img.shields.io/badge/Warung_POS-v1.0-brightgreen?style=for-the-badge)
![Go](https://img.shields.io/badge/Go-1.26-00ADD8?style=for-the-badge&logo=go)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-TiDB_Cloud-4479A1?style=for-the-badge&logo=mysql)
![License](https://img.shields.io/badge/Lisensi-Akademik-orange?style=for-the-badge)

**Sistem kasir digital berbasis web untuk warung, UMKM, dan toko kecil.**

</div>

---

## 📖 Deskripsi Aplikasi

**Warung POS** adalah aplikasi *Point of Sales* (POS) berbasis web yang dirancang untuk membantu pemilik usaha kecil menengah (UMKM) — seperti warung, minimarket, dan toko kelontong — dalam mengelola operasional bisnis sehari-hari secara digital dan efisien.

### 👥 Pengguna Sistem

| Role | Keterangan |
|------|-----------|
| **`owner`** | Pemilik warung. Akses penuh: transaksi, stok, manajemen kasir, laporan, langganan |
| **`kasir`** | Staf kasir. Dapat melakukan input transaksi dan melihat riwayat transaksinya sendiri |
| **`gudang`** | Staf gudang. Dapat mengelola stok barang dan melihat pergerakan stok |
| **`superadmin`** | Admin platform. Mengelola semua toko dan pengguna di level sistem |

---

## 🏗️ Arsitektur Sistem

```
POS-warung-pos/
│
├── be_warungpos/          ← Backend (Go + Fiber)
│   ├── config/            ← Koneksi database
│   ├── handler/           ← Controller: terima request, kirim response
│   ├── middleware/        ← Auth JWT & role guard
│   ├── migration/         ← File SQL migrasi manual
│   ├── model/             ← Struct entitas database (GORM)
│   ├── repository/        ← Data Access Layer (query ke DB)
│   ├── router/            ← Definisi endpoint API
│   └── main.go            ← Entry point
│
└── fe_warungpos/          ← Frontend (React + Vite)
    └── src/
        ├── components/    ← Komponen UI reusable
        ├── context/       ← State global (Auth, Theme, dll)
        ├── pages/         ← Halaman-halaman aplikasi
        ├── services/      ← HTTP client & interceptor API
        └── App.jsx        ← Root routing
```

**Alur Request:**
```
Browser (React) → Vite Dev Proxy (/api) → Backend Fiber (:3001) → MySQL (TiDB Cloud)
```

---

## ⚙️ Backend (`be_warungpos`)

Backend bertugas menyediakan **REST API** untuk semua operasi bisnis. Dibangun dengan Go menggunakan arsitektur berlapis: **Handler → Repository → Model**.

### 🛠️ Teknologi Backend

| Teknologi | Versi | Peran |
|-----------|-------|-------|
| **Go** | 1.26 | Bahasa pemrograman utama |
| **Fiber v2** | 2.52.13 | Web framework HTTP (REST API) |
| **GORM** | 1.31.1 | ORM untuk interaksi database |
| **MySQL Driver** | 1.6.0 | Driver koneksi ke MySQL/TiDB |
| **golang-jwt/jwt** | v5.3.1 | Generate & validasi token JWT |
| **bcrypt** | — | Hashing password pengguna |
| **godotenv** | 1.5.1 | Membaca variabel dari file `.env` |

### 📁 Struktur Folder Backend

```
be_warungpos/
│
├── config/
│   └── database.go         ← Inisialisasi koneksi GORM ke MySQL via DB_URL
│
├── handler/
│   ├── auth_handler.go     ← Login, register store, register user, me, user management
│   ├── pos_handler.go      ← Input transaksi, generate tagihan, pembayaran, riwayat, dashboard
│   ├── inventory_handler.go← CRUD produk, restock, adjusment stok, log pergerakan
│   ├── store_handler.go    ← Info toko, update toko, subscription (langganan)
│   └── admin_handler.go    ← Manajemen toko & pengguna level superadmin
│
├── middleware/
│   ├── auth.go             ← AuthMiddleware: validasi Bearer token JWT, inject claims ke context
│   └── role.go             ← RoleMiddleware: guard per role (OwnerOnly, KasirOnly, dll)
│
├── migration/
│   └── 001_add_users.sql   ← SQL migrasi manual (alter table transactions, tambah kasir_id)
│
├── model/
│   ├── user.go             ← Entitas User (id, name, username, email, role, store_id, dll)
│   ├── item.go             ← Entitas Item/Produk (id, name, price, stock, min_stock, category)
│   ├── transaction.go      ← Entitas Transaction & TransactionItem
│   ├── store.go            ← Entitas Store (id, name, address, phone, owner_id)
│   ├── subscription.go     ← Entitas Subscription (plan, status, started_at, expires_at)
│   ├── stock_movement.go   ← Entitas StockMovement (type, qty, note, user_id)
│   └── response.go         ← Struct Response standar API {message, data}
│
├── repository/
│   ├── user_repo.go        ← Query: cari user by username/email, update status, list
│   ├── item_repo.go        ← Query: ambil semua item berdasarkan store_id
│   ├── transaction_repo.go ← Query: buat, simpan, ambil transaksi & item transaksi
│   ├── stock_repo.go       ← Query: update stok, catat pergerakan stok
│   ├── store_repo.go       ← Query: ambil & update data toko
│   └── admin_repo.go       ← Query: dashboard admin, manajemen toko & user (superadmin)
│
├── router/
│   └── router.go           ← Daftarkan semua route API beserta middleware-nya
│
├── main.go                 ← Entry point: init DB, AutoMigrate, seed data, jalankan server
├── go.mod                  ← Definisi modul dan dependensi Go
└── .env                    ← Konfigurasi environment (DB_URL, JWT_SECRET, GATEWAY_URL)
```

### 🌐 Daftar Endpoint API

> Base URL: `http://localhost:3001`  
> Semua route yang membutuhkan auth menggunakan header: `Authorization: Bearer <token>`

#### 🔓 Auth Routes — `/api/auth`

| Method | Endpoint | Role | Keterangan |
|--------|----------|------|-----------|
| `POST` | `/api/auth/login` | Public | Login dengan username/email + password, mendapatkan JWT token |
| `POST` | `/api/auth/register-store` | Public | Daftarkan toko baru beserta akun owner |
| `POST` | `/api/auth/register` | `owner` | Owner menambah kasir/staf baru untuk tokonya |
| `GET` | `/api/auth/me` | Semua (auth) | Ambil data profil pengguna yang sedang login |
| `GET` | `/api/auth/users` | `owner` | Daftar semua user dalam toko yang dimiliki |
| `PUT` | `/api/auth/users/:id/status` | `owner` | Aktifkan / nonaktifkan akun staf |

#### 🧾 POS Routes — `/api/pos`

| Method | Endpoint | Role | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/pos/produk` | Semua (auth) | Daftar semua produk/item dalam toko |
| `POST` | `/api/pos/input` | `owner`, `kasir` | Input keranjang belanja (draft transaksi) |
| `POST` | `/api/pos/generate` | `owner`, `kasir` | Generate tagihan dari draft (hitung fee POS + grand total) |
| `POST` | `/api/pos/pay` | `owner`, `kasir` | Proses pembayaran, ubah status transaksi menjadi `paid` |
| `GET` | `/api/pos/riwayat` | `owner`, `kasir` | Riwayat transaksi (kasir hanya lihat miliknya sendiri) |
| `GET` | `/api/pos/biaya/:transaction_id` | Semua (auth) | Detail biaya layanan untuk 1 transaksi |
| `GET` | `/api/pos/aggregated-fees` | Semua (auth) | Total akumulasi fee POS untuk toko |
| `GET` | `/api/pos/dashboard` | `owner` | Data ringkasan dashboard (omzet, jumlah transaksi, dll) |

#### 🏬 Store & Subscription Routes — `/api/store`

| Method | Endpoint | Role | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/store/me` | `owner` | Informasi detail toko milik sendiri |
| `PUT` | `/api/store/me` | `owner` | Update nama, alamat, nomor telepon toko |
| `GET` | `/api/store/subscription` | `owner` | Status langganan aktif toko (plan, expired) |
| `GET` | `/api/store/subscription/plans` | `owner` | Daftar pilihan paket langganan yang tersedia |
| `POST` | `/api/store/subscription/upgrade` | `owner` | Upgrade paket langganan toko |

#### 📦 Inventory Routes — `/api/inventory`

| Method | Endpoint | Role | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/inventory/dashboard` | `owner`, `gudang` | Ringkasan stok, produk menipis, pergerakan terbaru |
| `GET` | `/api/inventory/products` | `owner`, `gudang` | Daftar lengkap semua produk beserta stoknya |
| `POST` | `/api/inventory/products` | `owner`, `gudang` | Tambah produk baru ke inventori toko |
| `PUT` | `/api/inventory/products/:id` | `owner`, `gudang` | Edit nama, harga, stok, kategori produk |
| `DELETE` | `/api/inventory/products/:id` | `owner`, `gudang` | Hapus produk dari inventori |
| `POST` | `/api/inventory/restock` | `owner`, `gudang` | Tambah stok (restock) untuk produk tertentu |
| `POST` | `/api/inventory/adjust` | `owner`, `gudang` | Adjust/koreksi stok secara manual |
| `GET` | `/api/inventory/movements/:item_id` | `owner`, `gudang` | Log riwayat pergerakan stok per produk |

#### 🔐 Admin Routes — `/api/admin`

| Method | Endpoint | Role | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/admin/dashboard` | `superadmin` | Statistik platform (total toko, user, transaksi) |
| `GET` | `/api/admin/stores` | `superadmin` | Daftar semua toko yang terdaftar di platform |
| `POST` | `/api/admin/stores` | `superadmin` | Buat toko baru melalui admin panel |
| `PUT` | `/api/admin/stores/:id/status` | `superadmin` | Aktifkan / blokir toko |
| `PUT` | `/api/admin/stores/:id/subscription` | `superadmin` | Override paket langganan toko |
| `DELETE` | `/api/admin/stores/:id` | `superadmin` | Hapus toko dari platform |
| `GET` | `/api/admin/users` | `superadmin` | Daftar semua pengguna di seluruh toko |
| `GET` | `/api/admin/transactions` | `superadmin` | Daftar semua transaksi dari semua toko |

### 🚀 Cara Menjalankan Backend

#### Prasyarat

- [Go](https://go.dev/dl/) versi **1.21+** sudah terinstall
- Akses ke database MySQL (lokal atau TiDB Cloud)

#### Langkah-Langkah

```bash
# 1. Masuk ke direktori backend
cd be_warungpos

# 2. Buat file .env dan isi sesuai konfigurasi database Anda
#    (lihat bagian Environment Variables di bawah)

# 3. Download semua dependensi Go
go mod tidy

# 4. Jalankan server (port 3001)
go run main.go
```

Backend akan berjalan di: **`http://localhost:3001`**

Saat pertama kali dijalankan, `main.go` akan otomatis:
- ✅ Menjalankan **AutoMigrate** GORM untuk membuat/update semua tabel
- ✅ Meng-seed akun **superadmin** default (`admin` / `admin123`) jika belum ada
- ✅ Meng-seed **data produk contoh** (Indomie, Beras, Telur, Kopi) jika tabel item kosong

---

## 🎨 Frontend (`fe_warungpos`)

Frontend adalah antarmuka pengguna berbasis web yang menghubungkan pengguna dengan semua fitur backend melalui tampilan yang intuitif.

### 🛠️ Teknologi Frontend

| Teknologi | Versi | Peran |
|-----------|-------|-------|
| **React** | 19.2 | Library UI utama berbasis komponen |
| **Vite** | 8.0 | Build tool & dev server dengan HMR |
| **Tailwind CSS** | 4.3 | Utility-first CSS framework untuk styling |
| **React Router DOM** | 7.15 | Navigasi & routing antar halaman |
| **Axios** | 1.16 | HTTP client untuk komunikasi dengan API |
| **Framer Motion** | 12.40 | Animasi dan transisi komponen |
| **Recharts** | 3.8 | Library chart untuk visualisasi data |
| **Lucide React** | 1.16 | Library ikon SVG modern |
| **Sonner** | 2.0 | Toast notification |

### 📁 Struktur Folder Frontend

```
fe_warungpos/
│
├── index.html                  ← Entry point HTML
├── vite.config.js              ← Konfigurasi Vite + proxy /api → localhost:3001
├── package.json                ← Daftar dependensi & scripts
│
└── src/
    ├── main.jsx                ← Mount React ke DOM
    ├── App.jsx                 ← Root: provider wrappers + routing utama
    │
    ├── components/             ← Komponen UI reusable
    │   ├── Header.jsx          ← Navbar atas dengan info user, notifikasi, & dark mode toggle
    │   ├── Sidebar.jsx         ← Sidebar navigasi utama (kasir/owner/gudang)
    │   ├── AdminSidebar.jsx    ← Sidebar khusus panel superadmin
    │   ├── Layout.jsx          ← Layout wrapper (Sidebar + Header + Outlet)
    │   └── ProtectedRoute.jsx  ← Guard: redirect ke /login jika belum autentikasi
    │
    ├── context/                ← State management global via React Context
    │   ├── AuthContext.jsx     ← State autentikasi: user, token, login(), logout()
    │   ├── ThemeContext.jsx    ← State tema: dark / light mode
    │   ├── WorkspaceContext.jsx← State toko aktif, produk, transaksi sementara
    │   └── SubscriptionContext.jsx ← State paket langganan & fitur yang tersedia
    │
    ├── pages/                  ← Halaman-halaman aplikasi
    │   ├── Login.jsx           ← Halaman login dengan form email/username + password
    │   ├── Register.jsx        ← Halaman pendaftaran toko baru (registrasi owner)
    │   ├── Dashboard.jsx       ← Dashboard utama: ringkasan omzet, transaksi, stok
    │   ├── InputTransaksi.jsx  ← Halaman kasir: pilih produk, isi qty, buat transaksi
    │   ├── GenerateTagihan.jsx ← Generate & tampilkan tagihan dari transaksi draft
    │   ├── RiwayatTransaksi.jsx← Tabel riwayat transaksi dengan filter & search
    │   ├── PaymentSuccess.jsx  ← Halaman konfirmasi setelah pembayaran berhasil
    │   ├── BiayaLayananPOS.jsx ← Detail biaya layanan POS & rincian fee per transaksi
    │   ├── Analytics.jsx       ← Grafik & analitik penjualan (chart omzet, produk terlaris)
    │   ├── InventoryDashboard.jsx ← Manajemen stok: daftar produk, restock, pergerakan
    │   ├── UserManagement.jsx  ← Manajemen kasir & staf (tambah, nonaktifkan)
    │   ├── Subscription.jsx    ← Halaman pilihan & upgrade paket langganan
    │   ├── SmartBankStatus.jsx ← Status integrasi payment gateway SmartBank
    │   ├── CustomerDisplay.jsx ← Tampilan layar pelanggan (secondary display kasir)
    │   ├── ErrorPages.jsx      ← Halaman error: 404, toko diblokir, perlu upgrade
    │   └── admin/              ← Halaman khusus superadmin
    │       ├── AdminLayout.jsx ← Layout khusus admin (dengan AdminSidebar)
    │       ├── AdminDashboard.jsx ← Statistik platform: toko, user, transaksi global
    │       └── AdminStores.jsx ← Manajemen semua toko: blokir, ubah langganan, hapus
    │
    └── services/
        └── api.js              ← Instance Axios + interceptor token & error handling global
```

### 🗺️ Routing Aplikasi

| Path | Komponen | Akses |
|------|----------|-------|
| `/login` | `Login.jsx` | Public |
| `/register` | `Register.jsx` | Public |
| `/customer` | `CustomerDisplay.jsx` | Public |
| `/dashboard` | `Dashboard.jsx` | Protected |
| `/transaksi/input` | `InputTransaksi.jsx` | Protected |
| `/transaksi/tagihan` | `GenerateTagihan.jsx` | Protected |
| `/transaksi/riwayat` | `RiwayatTransaksi.jsx` | Protected |
| `/transaksi/success` | `PaymentSuccess.jsx` | Protected |
| `/biaya-layanan` | `BiayaLayananPOS.jsx` | Protected |
| `/analytics` | `Analytics.jsx` | Protected |
| `/inventory` | `InventoryDashboard.jsx` | Protected |
| `/user-management` | `UserManagement.jsx` | Protected |
| `/subscription` | `Subscription.jsx` | Protected |
| `/admin/dashboard` | `AdminDashboard.jsx` | Superadmin |
| `/admin/stores` | `AdminStores.jsx` | Superadmin |

### 🚀 Cara Menjalankan Frontend

#### Prasyarat

- [Node.js](https://nodejs.org/) versi **18+** dan npm sudah terinstall

#### Langkah-Langkah

```bash
# 1. Masuk ke direktori frontend
cd fe_warungpos

# 2. Install semua dependensi
npm install

# 3. Jalankan development server
npm run dev
```

Frontend akan berjalan di: **`http://localhost:5173`**

> **Catatan:** Vite dikonfigurasi untuk mem-proxy semua request `/api` ke `http://localhost:3001` secara otomatis. Pastikan backend sudah berjalan sebelum menggunakan frontend.

---

## 🗄️ Database

### Informasi Database

| Properti | Nilai |
|----------|-------|
| **DBMS** | MySQL (kompatibel dengan **TiDB Cloud** — serverless MySQL) |
| **Nama Database** | `warungpos_db` |
| **ORM** | GORM (Auto Migrate + Query Builder) |
| **Setup** | AutoMigrate otomatis saat `go run main.go` |

### 📊 Struktur Tabel

#### `users` — Akun Pengguna

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | BIGINT PK | Auto increment |
| `name` | VARCHAR(100) | Nama lengkap pengguna |
| `username` | VARCHAR(50) UNIQUE | Username login (unik) |
| `email` | VARCHAR(100) UNIQUE | Email login (unik) |
| `password` | VARCHAR(255) | Password ter-hash dengan bcrypt |
| `role` | VARCHAR(20) | Role: `owner`, `kasir`, `gudang`, `superadmin` |
| `store_id` | BIGINT FK | Referensi ke `stores.id` (nullable untuk superadmin) |
| `smartbank_user_id` | VARCHAR(100) | ID pengguna di sistem SmartBank (opsional) |
| `is_active` | BOOLEAN | Status aktif/nonaktif akun (default: `true`) |
| `created_at` | TIMESTAMP | Waktu pendaftaran |

#### `stores` — Data Toko

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | BIGINT PK | Auto increment |
| `name` | VARCHAR(150) | Nama toko |
| `address` | VARCHAR(255) | Alamat toko (opsional) |
| `phone` | VARCHAR(20) | Nomor telepon toko (opsional) |
| `owner_id` | BIGINT FK | Referensi ke `users.id` (pemilik toko) |
| `is_active` | BOOLEAN | Status aktif toko (default: `true`) |
| `created_at` | TIMESTAMP | Waktu pendaftaran toko |

#### `subscriptions` — Paket Langganan Toko

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | BIGINT PK | Auto increment |
| `store_id` | BIGINT FK | Referensi ke `stores.id` |
| `plan` | VARCHAR(20) | Nama paket: `basic`, `pro`, `enterprise` (default: `basic`) |
| `status` | VARCHAR(20) | Status: `active`, `expired` (default: `active`) |
| `started_at` | TIMESTAMP | Tanggal mulai berlangganan |
| `expires_at` | TIMESTAMP | Tanggal kadaluarsa langganan |
| `created_at` | TIMESTAMP | Waktu record dibuat |

#### `items` — Produk / Barang Dagangan

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | BIGINT PK | Auto increment |
| `name` | VARCHAR(100) | Nama produk |
| `price` | FLOAT | Harga jual satuan |
| `stock` | INT | Jumlah stok saat ini (default: 0) |
| `min_stock` | INT | Batas minimum stok untuk peringatan (default: 10) |
| `category` | VARCHAR(50) | Kategori produk (opsional) |
| `store_id` | BIGINT FK | Referensi ke `stores.id` |

#### `transactions` — Header Transaksi

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | BIGINT PK | Auto increment |
| `user_id` | VARCHAR(100) | ID/nama kasir (legacy field) |
| `kasir_id` | BIGINT FK | Referensi ke `users.id` (kasir yang input) |
| `store_id` | BIGINT FK | Referensi ke `stores.id` |
| `total_amount` | FLOAT | Total harga sebelum fee |
| `fee_pos` | FLOAT | Biaya layanan POS |
| `grand_total` | FLOAT | Total akhir (total_amount + fee_pos) |
| `status` | VARCHAR(20) | Status: `draft` → `generated` → `paid` |
| `smartbank_ref` | VARCHAR(100) | Nomor referensi pembayaran SmartBank (opsional) |
| `created_at` | TIMESTAMP | Waktu transaksi dibuat |
| `updated_at` | TIMESTAMP | Waktu terakhir diperbarui |

#### `transaction_items` — Detail Item per Transaksi

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | BIGINT PK | Auto increment |
| `transaction_id` | BIGINT FK | Referensi ke `transactions.id` |
| `item_id` | BIGINT FK | Referensi ke `items.id` |
| `qty` | INT | Jumlah unit yang dibeli |
| `price` | FLOAT | Harga satuan saat transaksi |
| `subtotal` | FLOAT | qty × price |

#### `stock_movements` — Log Pergerakan Stok

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | BIGINT PK | Auto increment |
| `store_id` | BIGINT FK | Referensi ke `stores.id` |
| `item_id` | BIGINT FK | Referensi ke `items.id` |
| `type` | VARCHAR(20) | Jenis: `sale`, `restock`, `adjustment` |
| `qty` | INT | Jumlah stok yang bergerak |
| `note` | VARCHAR(255) | Catatan pergerakan (opsional) |
| `user_id` | BIGINT FK | Referensi ke `users.id` (siapa yang melakukan) |
| `created_at` | TIMESTAMP | Waktu pergerakan stok terjadi |

### 🔗 Relasi Antar Tabel

```
stores (1) ─────────────────────────────────────────────┐
  │                                                      │
  ├──< (many) users.store_id          [one-to-many]      │
  │     └── stores.owner_id → users   [belongs-to]       │
  │                                                      │
  ├──< (many) items.store_id          [one-to-many]      │
  │     └──< transaction_items.item_id                   │
  │     └──< stock_movements.item_id                     │
  │                                                      │
  ├──< (many) transactions.store_id   [one-to-many]      │
  │     └──< transaction_items.transaction_id            │
  │                                                      │
  └──< (one) subscriptions.store_id   [one-to-one]
```

### ⚙️ Setup Database

Database dibuat otomatis oleh GORM AutoMigrate saat backend pertama kali dijalankan. **Tidak perlu menjalankan SQL manual** untuk setup awal.

Jika memerlukan migrasi manual (misalnya menambah kolom ke tabel yang sudah ada), gunakan file di folder `migration/`:

```bash
# Contoh: jalankan file SQL migrasi manual di MySQL client
mysql -h <host> -u <user> -p warungpos_db < be_warungpos/migration/001_add_users.sql
```

---

## 🔑 Environment Variables

Buat file `.env` di dalam folder `be_warungpos/` dengan isi berikut:

```env
# =============================================
# DATABASE
# =============================================
# DSN (Data Source Name) lengkap untuk koneksi MySQL
# Format: user:password@tcp(host:port)/dbname?param=value
# Untuk TiDB Cloud, tambahkan parameter tls=true
DB_URL="user:password@tcp(localhost:3306)/warungpos_db?charset=utf8mb4&parseTime=True&loc=Local"

# =============================================
# AUTHENTICATION
# =============================================
# Secret key untuk signing & verifikasi token JWT
# Gunakan string acak yang panjang dan tidak mudah ditebak!
JWT_SECRET="ganti_dengan_secret_key_yang_kuat_dan_unik"

# =============================================
# PAYMENT GATEWAY (SmartBank)
# =============================================
# URL endpoint Gateway pembayaran SmartBank
# Untuk development lokal, bisa gunakan mock server
GATEWAY_URL="http://localhost:8080/gateway"
```

| Variabel | Wajib | Keterangan |
|----------|-------|-----------|
| `DB_URL` | ✅ Ya | Connection string MySQL/TiDB. Backend tidak akan berjalan tanpa ini |
| `JWT_SECRET` | ✅ Ya | Secret key untuk JWT. Gunakan string acak minimal 32 karakter |
| `GATEWAY_URL` | ⚠️ Opsional | URL payment gateway SmartBank. Bisa dikosongi jika tidak menggunakan fitur pembayaran |

---

## 🚀 Setup Lengkap (End-to-End)

Ikuti langkah berikut untuk menjalankan seluruh sistem dari awal:

### Langkah 1 — Clone Repository

```bash
git clone https://github.com/Ekosistem-Pulu-Pulu/POS-warung-pos-.git
cd POS-warung-pos-
```

### Langkah 2 — Setup & Jalankan Backend

```bash
# Masuk ke folder backend
cd be_warungpos

# Buat file .env dan isi sesuai konfigurasi database Anda
# (Salin contoh dari bagian Environment Variables di atas)

# Download dependensi Go
go mod tidy

# Jalankan backend (port 3001)
# AutoMigrate & seed data berjalan otomatis
go run main.go
```

✅ Pastikan muncul log: `WarungPOS backend is running on port 3001`

### Langkah 3 — Setup & Jalankan Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd fe_warungpos

# Install dependensi Node.js
npm install

# Jalankan development server (port 5173)
npm run dev
```

✅ Pastikan muncul: `Local: http://localhost:5173/`

### Langkah 4 — Akses Aplikasi

Buka browser dan kunjungi: **`http://localhost:5173`**

Login menggunakan akun default yang di-seed otomatis:

| Role | Username | Password |
|------|----------|----------|
| Superadmin | `admin` | `admin123` |

> Untuk membuat toko baru, kunjungi halaman `/register` dan daftarkan toko Anda. Setelah itu login sebagai owner untuk menambah kasir melalui menu **User Management**.

---

## 📋 Fitur Lengkap Aplikasi

| Fitur | Role | Keterangan |
|-------|------|-----------|
| ✅ Login & Autentikasi JWT | Semua | Sesi aman dengan token yang tersimpan di sessionStorage |
| ✅ Registrasi Toko | Public | Daftarkan warung baru beserta akun owner |
| ✅ Dashboard | Owner, Kasir | Ringkasan omzet, jumlah transaksi, produk terlaris |
| ✅ Input Transaksi | Owner, Kasir | Pilih produk dari daftar, tentukan qty, simpan draft |
| ✅ Generate Tagihan | Owner, Kasir | Hitung total + fee POS, cetak tagihan |
| ✅ Pembayaran | Owner, Kasir | Proses pembayaran via SmartBank gateway |
| ✅ Riwayat Transaksi | Owner, Kasir | Lihat, filter, dan cari transaksi lampau |
| ✅ Manajemen Inventori | Owner, Gudang | CRUD produk, restock, koreksi stok |
| ✅ Log Pergerakan Stok | Owner, Gudang | Audit trail setiap perubahan stok |
| ✅ Analitik Penjualan | Owner | Grafik trend penjualan & produk terlaris |
| ✅ Manajemen Pengguna | Owner | Tambah kasir, aktifkan/nonaktifkan akun |
| ✅ Manajemen Langganan | Owner | Lihat dan upgrade paket berlangganan |
| ✅ Customer Display | Kasir | Tampilan layar pelanggan saat transaksi |
| ✅ Dark Mode | Semua | Toggle tema terang/gelap |
| ✅ Panel Superadmin | Superadmin | Kelola semua toko, blokir, ubah langganan |

---

## 👥 Tim Pengembang

Proyek ini dikembangkan sebagai tugas akademik dalam mata kuliah Pengembangan Perangkat Lunak oleh **Ekosistem Pulu-Pulu**.

---

## 📄 Lisensi

Proyek ini digunakan untuk kebutuhan **pembelajaran, penelitian, dan pengembangan sistem informasi** berbasis web. Lihat file [LICENSE](./LICENSE) untuk detail lebih lanjut.
