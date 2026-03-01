import bcrypt
import uuid
from flask import Blueprint, request, jsonify

from config import USE_SQLITE
from db import query, get_connection
from auth_middleware import token_required, admin_only

bp = Blueprint("users", __name__, url_prefix="/api/users")


@bp.route("/", methods=["GET"], strict_slashes=False)
@token_required
@admin_only
def list_users():
    try:
        rows = query("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC")
        for r in rows:
            r["id"] = str(r["id"])
            if r.get("created_at") and hasattr(r["created_at"], "isoformat"):
                r["created_at"] = r["created_at"].isoformat()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": "Kullanıcılar listelenemedi."}), 500


@bp.route("/", methods=["POST"], strict_slashes=False)
@token_required
@admin_only
def create_user():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password")
    role = "admin" if data.get("role") == "admin" else "user"
    if not username or not password:
        return jsonify({"error": "Kullanıcı adı ve şifre gerekli."}), 400

    try:
        if USE_SQLITE:
            user_id = str(uuid.uuid4())
            pw_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            query(
                "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)",
                [user_id, username, pw_hash, role],
            )
            row = query("SELECT id, username, role, created_at FROM users WHERE id = ?", [user_id], one=True)
        else:
            conn = get_connection()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO users (username, password_hash, role) VALUES (%s, crypt(%s, gen_salt('bf')), %s) RETURNING id, username, role, created_at",
                [username, password, role],
            )
            r = cur.fetchone()
            conn.commit()
            conn.close()
            row = {"id": str(r[0]), "username": r[1], "role": r[2], "created_at": r[3].isoformat() if r[3] else None}
        if row.get("created_at") and hasattr(row["created_at"], "isoformat"):
            row["created_at"] = row["created_at"].isoformat()
        row["id"] = str(row["id"])
        return jsonify(row), 201
    except Exception as e:
        if "UNIQUE" in str(e) or "23505" in str(e):
            return jsonify({"error": "Bu kullanıcı adı zaten kullanılıyor."}), 400
        return jsonify({"error": "Kullanıcı oluşturulamadı."}), 500


@bp.route("/<user_id>", methods=["DELETE"], strict_slashes=False)
@token_required
@admin_only
def delete_user(user_id):
    if not user_id:
        return jsonify({"error": "Kullanıcı id gerekli."}), 400
    try:
        if USE_SQLITE:
            query("DELETE FROM users WHERE id = ?", [user_id])
        else:
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("DELETE FROM users WHERE id = %s", [user_id])
            conn.commit()
            conn.close()
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": "Kullanıcı silinemedi."}), 500
