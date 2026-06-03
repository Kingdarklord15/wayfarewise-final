import os
from datetime import timedelta

from dotenv import load_dotenv


load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")
    JWT_SECRET = os.getenv("JWT_SECRET", SECRET_KEY)
    JWT_EXPIRES_DELTA = timedelta(days=int(os.getenv("JWT_EXPIRES_DAYS", "7")))
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ai_travel_planner")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN", "")
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    PORT = int(os.getenv("PORT", "5000"))
