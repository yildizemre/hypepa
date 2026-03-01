#!/usr/bin/env python3
"""
Veritabanı tablosu ve admin kullanıcısı oluşturur.
İlk kurulumda: python seed.py
DATABASE_URL boş veya sqlite ise SQLite kullanılır (PostgreSQL gerekmez).
"""
import os
import sys
import uuid
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
USE_SQLITE = not DATABASE_URL or DATABASE_URL.lower().startswith("sqlite")

def main():
    if USE_SQLITE:
        import bcrypt
        import sqlite3
        db_path = DATABASE_URL.replace("sqlite:", "").strip() if DATABASE_URL else Path(__file__).parent / "data" / "hype.db"
        db_path = str(db_path)
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(db_path)
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
                created_at TEXT DEFAULT (datetime('now'))
            );
        """)
        admin_hash = bcrypt.hashpw(b"emre1234", bcrypt.gensalt()).decode("utf-8")
        conn.execute(
            """INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)
               ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role""",
            [str(uuid.uuid4()), "admin", admin_hash, "admin"],
        )
        conn.commit()
        conn.close()
        print("Tamamlandı (SQLite): Tablo ve admin kullanıcısı hazır.")
    else:
        try:
            import psycopg2
            from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
        except ImportError:
            print("PostgreSQL için: pip install psycopg2-binary")
            sys.exit(1)
        conn = psycopg2.connect(DATABASE_URL)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        cur.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
                created_at TIMESTAMPTZ DEFAULT now()
            );
        """)
        cur.execute(
            """INSERT INTO users (username, password_hash, role) VALUES ('admin', crypt('emre1234', gen_salt('bf')), 'admin')
               ON CONFLICT (username) DO UPDATE SET password_hash = crypt('emre1234', gen_salt('bf')), role = 'admin';""",
        )
        conn.close()
        print("Tamamlandı (PostgreSQL): Tablo ve admin kullanıcısı hazır.")
    print("Giriş: kullanıcı adı = admin, şifre = emre1234")


if __name__ == "__main__":
    main()
