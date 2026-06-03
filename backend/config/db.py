from datetime import datetime
from uuid import uuid4

from pymongo import MongoClient
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError

from config.settings import Config


class MemoryCollection:
    def __init__(self):
        self.rows = []

    def insert_one(self, document):
        document = dict(document)
        document.setdefault("_id", uuid4().hex)
        document.setdefault("created_at", datetime.utcnow())
        self.rows.append(document)

        class Result:
            inserted_id = document["_id"]

        return Result()

    def find_one(self, query):
        for row in self.rows:
            if all(row.get(key) == value for key, value in query.items()):
                return dict(row)
        return None

    def find(self, query=None):
        query = query or {}
        matches = []
        for row in self.rows:
            if all(row.get(key) == value for key, value in query.items()):
                matches.append(dict(row))
        return matches

    def update_one(self, query, update, upsert=False):
        row = self.find_one(query)
        if row is None and upsert:
            row = dict(query)
            self.rows.append(row)
        if row is None:
            return None
        for stored in self.rows:
            if stored.get("_id") == row.get("_id") or all(stored.get(key) == value for key, value in query.items()):
                stored.update(update.get("$set", {}))
                if "$push" in update:
                    for key, value in update["$push"].items():
                        stored.setdefault(key, []).append(value)
                break
        return None


class MemoryDatabase:
    def __init__(self):
        self.users = MemoryCollection()
        self.trips = MemoryCollection()
        self.searches = MemoryCollection()
        self.favorites = MemoryCollection()


client = None
db = None
using_memory = False


def get_db():
    global client, db, using_memory
    if db is not None:
        return db
    try:
        client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=1200)
        client.admin.command("ping")
        db = client.get_default_database()
        if db.name is None:
            db = client.ai_travel_planner
    except (PyMongoError, ServerSelectionTimeoutError):
        using_memory = True
        db = MemoryDatabase()
    return db
