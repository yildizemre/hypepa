import os
import sqlite3
from pathlib import Path

from config import USE_SQLITE, DATABASE_URL

_db_path = None
if USE_SQLITE:
    _db_path = DATABASE_URL.replace("sqlite:", "").strip() or str(Path(__file__).parent / "data" / "hype.db")
    Path(_db_path).parent.mkdir(parents=True, exist_ok=True)

def get_connection():
    if USE_SQLITE:
        conn = sqlite3.connect(_db_path)
        conn.row_factory = sqlite3.Row
        return conn
    import psycopg2
    return psycopg2.connect(DATABASE_URL)

def query(sql, params=None, one=False):
    conn = get_connection()
    try:
        params = params or []
        if USE_SQLITE:
            sql = sql.replace("$1", "?").replace("$2", "?").replace("$3", "?").replace("$4", "?")
        else:
            sql = sql.replace("?", "%s")
        cur = conn.cursor()
        cur.execute(sql, params)
        if sql.strip().upper().startswith("SELECT"):
            rows = cur.fetchall()
            if USE_SQLITE:
                rows = [dict(r) for r in rows]
            else:
                cols = [d[0] for d in cur.description]
                rows = [dict(zip(cols, r)) for r in rows]
            return rows[0] if one and rows else (rows if not one else None)
        conn.commit()
        return None
    finally:
        conn.close()
