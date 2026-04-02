# Orbitra – Kurulum

Backend Python (Flask). Varsayılan veritabanı SQLite (kurulum yok); isteğe bağlı PostgreSQL.

## 1. Backend (Python / Flask)

```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

`.env` içinde `DATABASE_URL` boş bırakılırsa SQLite kullanılır. PostgreSQL için: `DATABASE_URL=postgresql://kullanici:sifre@localhost:5432/orbitra_vision`

Admin kullanıcısını oluşturun (bir kez):

```bash
python seed.py
```

API'yi başlatın:

```bash
python app.py
```

API: `http://localhost:3001`

---

## 2. Frontend

Proje kökünde:

```bash
cp .env.example .env
```

`.env` içinde (backend aynı makinede 3001 portundaysa):

```env
VITE_API_URL=http://localhost:3001
```

Sonra:

```bash
npm install
npm run dev
```

Tarayıcıda açın; **admin / admin** ile giriş yapın. **Yeni kullanıcı ekleme yetkisi sadece admin hesabındadır** — Kontrol Paneli → Kullanıcı Yönetimi'nden yeni kullanıcı ekleyebilirsiniz. "Sunucuya bağlanılamadı" hatası alırsanız backend'in çalıştığından emin olun: `cd server && python app.py`

---

## Özet

| Bileşen      | Port / Adres           | Açıklama                          |
|-------------|------------------------|-----------------------------------|
| Backend API | http://localhost:3001 | Python Flask, giriş + kullanıcılar |
| Frontend    | http://localhost:5173 | Vite                              |

Varsayılan: SQLite (`server/data/hype.db`). İsterseniz PostgreSQL ile de kullanabilirsiniz.
