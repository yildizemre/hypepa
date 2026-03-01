import jwt
from functools import wraps
from flask import request, jsonify

from config import JWT_SECRET


def get_jwt_secret():
    return JWT_SECRET


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return jsonify({"error": "Token gerekli."}), 401
        token = auth[7:]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = payload
            return f(*args, **kwargs)
        except jwt.InvalidTokenError:
            return jsonify({"error": "Geçersiz veya süresi dolmuş token."}), 401
    return decorated


def admin_only(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if getattr(request, "user", {}).get("role") != "admin":
            return jsonify({"error": "Bu işlem için yönetici yetkisi gerekli."}), 403
        return f(*args, **kwargs)
    return decorated
