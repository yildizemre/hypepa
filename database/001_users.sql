-- Hype Vision: Kendi PostgreSQL veritabanınızda çalıştırın.
-- Örnek: psql -U postgres -d hype_vision -f 001_users.sql
-- veya pgAdmin / DBeaver ile bu dosyayı açıp çalıştırın.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Varsayılan admin (kullanıcı: admin, şifre: admin)
INSERT INTO users (username, password_hash, role)
VALUES ('admin', crypt('admin', gen_salt('bf')), 'admin')
ON CONFLICT (username) DO NOTHING;
