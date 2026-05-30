from functools import wraps
from datetime import datetime, timezone

import jwt
from flask import jsonify, request

from config.settings import Config

def create_token(user):
    payload = {
        "user_id": user["id"],
        "email": user["email"],
        "exp": datetime.now(timezone.utc)
               + Config.JWT_EXPIRES_DELTA
    }

    return jwt.encode(
        payload,
        Config.JWT_SECRET,
        algorithm="HS256"
    )


def token_required(route):
    @wraps(route)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        token = header.replace("Bearer ", "").strip()
        if not token:
            return jsonify({"message": "Authentication token is required"}), 401
        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
        except jwt.PyJWTError:
            return jsonify({"message": "Invalid or expired token"}), 401
        request.user = payload
        return route(*args, **kwargs)

    return wrapper
