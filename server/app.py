from flask import Flask, jsonify
from flask_cors import CORS

from config import PORT
from routes.auth_routes import bp as auth_bp
from routes.user_routes import bp as users_bp

app = Flask(__name__)
# localhost ve 127.0.0.1 farklı origin sayıldığı için ikisini de izin ver
CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)


@app.route("/api/health")
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    print(f"Hype Vision API http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
