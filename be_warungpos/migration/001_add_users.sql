-- =============================================
-- Migration 001: Tambah tabel users & kolom baru
-- Tanggal: 2026-05-24
-- =============================================

-- Buat tabel users (jika belum ada)
CREATE TABLE IF NOT EXISTS users (
  id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
  name                VARCHAR(100) NOT NULL,
  username            VARCHAR(50)  UNIQUE NOT NULL,
  email               VARCHAR(100) UNIQUE NOT NULL,
  password            VARCHAR(255) NOT NULL,
  role                ENUM('owner','kasir','gudang') NOT NULL,
  smartbank_user_id   VARCHAR(100),
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Kolom yang SUDAH ADA di transactions (SKIP):
--   status    → sudah ada (varchar, nilai: draft/generated/paid) — DIPERTAHANKAN
--   fee_pos   → sudah ada (float)
--   user_id   → sudah ada (varchar, string bebas)
-- =============================================

-- Tambah kolom smartbank_ref (belum ada di transactions):
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS smartbank_ref VARCHAR(100);

-- Tambah kolom kasir_id sebagai FK ke users (kolom baru, tidak ubah user_id lama):
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS kasir_id BIGINT,
  ADD CONSTRAINT fk_transactions_kasir FOREIGN KEY (kasir_id) REFERENCES users(id);
