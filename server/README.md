# Orbitra API (Python / Flask)

## Kurulum

```bash
cd server
python -m venv venv
venv\Scripts\activate   # Windows
# veya: source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
```

## Admin kullanıcısı (ilk kez)

```bash
python seed.py
```

Giriş: **admin** / **admin**

## Çalıştırma

```bash
python app.py
```

API: http://localhost:3001

- `POST /api/auth/login` — Giriş (username, password)
- `GET /api/users` — Kullanıcı listesi (Bearer token, admin)
- `POST /api/users` — Yeni kullanıcı (Bearer token, admin)

## Veritabanı

- **DATABASE_URL** boş → SQLite (`server/data/hype.db`)
- **DATABASE_URL=postgresql://...** → PostgreSQL
