from flask import Flask, jsonify
from flask_cors import CORS

from config.settings import Config
from routes.auth_routes import auth_bp
from routes.travel_routes import travel_bp
from routes.user_routes import user_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(travel_bp, url_prefix="/api/travel")
    app.register_blueprint(user_bp, url_prefix="/api/user")

    @app.get("/")
    def health():
        return jsonify(
            {
                "name": "WayfareWise API",
                "status": "running",
                "version": "1.0.0",
                "docs": {
                    "auth": "/api/auth",
                    "travel": "/api/travel",
                    "user": "/api/user",
                },
            }
        )

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"message": "Route not found"}), 404

    @app.errorhandler(Exception)
    def server_error(error):
        return jsonify({"message": "Server error", "detail": str(error)}), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
