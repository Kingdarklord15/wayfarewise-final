from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from config.db import get_db


def create_user(name, email, password):
    db = get_db()
    user = {
        "name": name.strip(),
        "email": email.strip().lower(),
        "password": generate_password_hash(password),
        "favorites": [],
        "recent_searches": [],
        "created_at": datetime.utcnow(),
    }
    result = db.users.insert_one(user)
    user["_id"] = result.inserted_id
    return serialize_user(user)


def find_user_by_email(email):
    user = get_db().users.find_one({"email": email.strip().lower()})
    return user


def verify_password(user, password):
    return check_password_hash(user["password"], password)


def serialize_user(user):
    return {
        "id": str(user.get("_id")),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "favorites": user.get("favorites", []),
        "recent_searches": user.get("recent_searches", []),
    }
