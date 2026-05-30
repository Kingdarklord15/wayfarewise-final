from flask import jsonify, request

from middleware.auth_middleware import create_token
from models.user_model import create_user, find_user_by_email, serialize_user, verify_password


def signup():
    payload = request.get_json(silent=True) or {}
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400
    if find_user_by_email(email):
        return jsonify({"message": "Email already exists"}), 409

    user = create_user(name, email, password)
    token = create_token(user)
    return jsonify({"user": user, "token": token}), 201


def login():
    payload = request.get_json(silent=True) or {}
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    user = find_user_by_email(email)
    if not user or not verify_password(user, password):
        return jsonify({"message": "Invalid email or password"}), 401
    clean_user = serialize_user(user)
    token = create_token(clean_user)
    return jsonify({"user": clean_user, "token": token})
