import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", "3001"))
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
JWT_SECRET = os.getenv("JWT_SECRET", "hype-vision-dev-secret-en-az-32-karakter-olmali")
JWT_EXPIRE_DAYS = 7

USE_SQLITE = not DATABASE_URL or DATABASE_URL.lower().startswith("sqlite")
