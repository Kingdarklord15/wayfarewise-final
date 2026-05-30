from flask import jsonify, request

from models.trip_model import add_favorite, list_favorites, list_searches, list_trips


def dashboard():
    user_id = request.user["user_id"]
    return jsonify(
    {
        "saved_trips": list_trips(user_id),
        "stats": {
            "saved_trips": len(list_trips(user_id)),
        },
    }
)


def favorite():
    user_id = request.user["user_id"]
    payload = request.get_json(silent=True) or {}
    destination = payload.get("destination")
    if not destination:
        return jsonify({"message": "Destination is required"}), 400
    return jsonify(add_favorite(user_id, destination)), 201
