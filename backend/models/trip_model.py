from datetime import datetime

from config.db import get_db


def save_trip(user_id, trip):
    document = {
        "user_id": user_id,
        "trip": trip,
        "created_at": datetime.utcnow(),
    }
    result = get_db().trips.insert_one(document)
    document["_id"] = result.inserted_id
    return serialize_trip(document)


def list_trips(user_id):
    trips = get_db().trips.find({"user_id": user_id})
    return [serialize_trip(trip) for trip in trips]


def save_search(user_id, search):
    document = {
        "user_id": user_id,
        "search": search,
        "created_at": datetime.utcnow(),
    }
    get_db().searches.insert_one(document)
    return document


def list_searches(user_id):
    rows = get_db().searches.find({"user_id": user_id})
    return [
        {
            "query": row.get("search", {}),
            "created_at": str(row.get("created_at", "")),
        }
        for row in rows
    ][-8:]


def add_favorite(user_id, destination):
    document = {
        "user_id": user_id,
        "destination": destination,
        "created_at": datetime.utcnow(),
    }
    get_db().favorites.insert_one(document)
    return {"destination": destination}


def list_favorites(user_id):
    rows = get_db().favorites.find({"user_id": user_id})
    return [row.get("destination") for row in rows]


def serialize_trip(document):
    return {
        "id": str(document.get("_id")),
        "trip": document.get("trip", {}),
        "created_at": str(document.get("created_at", "")),
    }
