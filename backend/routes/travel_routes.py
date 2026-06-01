from flask import Blueprint

from controllers.travel_controller import (
    all_destinations,
    budget,
    chat,
    chat_stream,
    crowd,
    gems,
    hotels,
    itinerary,
    maps,
    recommendations,
    reviews,
    save_current_trip,
    weather,
)
from middleware.auth_middleware import token_required


travel_bp = Blueprint("travel", __name__)

travel_bp.get("/destinations")(all_destinations)
travel_bp.post("/recommendations")(recommendations)
travel_bp.post("/itinerary")(itinerary)
travel_bp.post("/chat")(chat)
travel_bp.post("/chat/stream")(chat_stream)
travel_bp.post("/hotels/<destination_id>")(hotels)
travel_bp.get("/hidden-gems/<destination_id>")(gems)
travel_bp.get("/weather/<destination_id>")(weather)
travel_bp.get("/reviews/<destination_id>")(reviews)
travel_bp.post("/budget/<destination_id>")(budget)
travel_bp.post("/crowd/<destination_id>")(crowd)
travel_bp.post("/maps")(maps)
travel_bp.post("/save-trip")(token_required(save_current_trip))
