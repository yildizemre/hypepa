import jwt
import bcrypt
from flask import Blueprint, request, jsonify

from config import USE_SQLITE, JWT_SECRET, JWT_EXPIRE_DAYS
from db import query
from auth_middleware import get_jwt_secret

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Kullanıcı adı ve şifre gerekli."}), 400

    if USE_SQLITE:
        row = query(
            "SELECT id, username, role, created_at, password_hash FROM users WHERE username = ?",
            [username],
            one=True,
        )
        if not row:
            return jsonify({"error": "Geçersiz kullanıcı adı veya şifre."}), 401
        raw_hash = row["password_hash"]
        hash_bytes = raw_hash.encode("utf-8") if isinstance(raw_hash, str) else raw_hash
        if not bcrypt.checkpw(password.encode("utf-8"), hash_bytes):
            return jsonify({"error": "Geçersiz kullanıcı adı veya şifre."}), 401
        row = dict(row)
        row.pop("password_hash", None)
    else:
        from db import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, username, role, created_at FROM users WHERE username = %s AND password_hash = crypt(%s, password_hash)",
            [username, password],
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return jsonify({"error": "Geçersiz kullanıcı adı veya şifre."}), 401
        row = {"id": str(row[0]), "username": row[1], "role": row[2], "created_at": row[3].isoformat() if row[3] else None}

    user = {
        "id": str(row["id"]),
        "username": row["username"],
        "role": row["role"],
        "created_at": row.get("created_at"),
    }
    token = jwt.encode(
        {"id": user["id"], "username": user["username"], "role": user["role"]},
        get_jwt_secret(),
        algorithm="HS256",
    )
    if hasattr(token, "decode"):
        token = token.decode("utf-8")
    return jsonify({"user": user, "token": token})
