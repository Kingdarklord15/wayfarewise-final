import json
import re

from flask import (
    Response,
    jsonify,
    request,
    stream_with_context
)

from models.trip_model import (
    save_search,
    save_trip
)

from services.openai_service import generate_itinerary

from services.data_service import DESTINATIONS

from services.map_service import map_payload

from services.openai_service import (
    chat_answer,
    generate_itinerary,
    stream_chat_answer,
    summarize_reviews,
)

from services.recommendation_service import (
    budget_optimizer,
    hidden_gems,
    normalize_trip,
    recommend,
    recommend_hotels,
)

from services.weather_service import weather_for


def all_destinations():

    return jsonify({
        "destinations": DESTINATIONS
    })


def recommendations():
    try:
        trip = normalize_trip(
            request.get_json(silent=True) or {}
        )

        print("FULL TRIP =", trip)

        results = recommend(
            trip,
            limit=6
        )

        return jsonify({
            "input": trip,
            "recommendations": results,
            "map": map_payload(results[:3])
        })

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500


def itinerary():
    try:

        trip = normalize_trip(
            request.get_json(silent=True) or {}
        )

        results = recommend(
            trip,
            limit=1
        )

        destination = results[0] if results else None

        if not destination:
            return jsonify({
                "error": "No destination found"
            }), 404

        itinerary_data = generate_itinerary(
            destination,
            trip
        )

        return jsonify({
            "itinerary": itinerary_data
        })

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500
# =========================================================
# IMPROVED CHAT PARSER
# =========================================================

def trip_from_payload(message, payload):

    trip = normalize_trip(
        payload.get("preferences", {})
    )

    if not message:
        return trip

    lowered = message.lower()

    # ---------- INTEREST DETECTION ----------
    interest_keywords = {

        # mountains
        "mountain": "mountains",
        "mountains": "mountains",
        "hill": "mountains",
        "snow": "snow",
        "trek": "trek",
        "trekking": "trek",
        "forest": "forest",
        "nature": "nature",
        "waterfall": "waterfalls",
        "wildlife": "wildlife",

        # beaches
        "beach": "beaches",
        "beaches": "beaches",
        "sea": "beaches",
        "island": "beaches",

        # cafes / food
        "cafe": "cafes",
        "cafes": "cafes",
        "coffee": "coffee",
        "food": "food",
        "seafood": "seafood",

        # luxury / romantic
        "luxury": "luxury",
        "romantic": "romantic",

        # party
        "party": "party",
        "nightlife": "nightlife",
        "fun": "fun",

        # spiritual
        "spiritual": "spiritual",
        "temple": "spiritual",
        "peaceful": "peaceful",

        # photography
        "photography": "photography",
        "photo": "photography",

        # adventure
        "adventure": "adventure",
        "rafting": "rafting",
        "river": "river",

        # culture
        "culture": "culture",
        "heritage": "heritage",
        "shopping": "shopping",
    }

    # IMPORTANT FIX:
    # DO NOT start with default interests
    detected_interests = set()

    for keyword, mapped in interest_keywords.items():

        if keyword in lowered:
            detected_interests.add(mapped)

    # Only override if user actually mentioned interests
    if detected_interests:

        trip["interests"] = list(
            detected_interests
        )

    # ---------- MOOD DETECTION ----------
    mood_map = {

        "peaceful": "peaceful",
        "calm": "relaxing",
        "relax": "relaxing",
        "romantic": "romantic",
        "luxury": "luxury",
        "adventure": "adventurous",
        "fun": "fun",
        "party": "party",
        "spiritual": "spiritual",
        "nature": "peaceful",
    }

    detected_moods = []

    for keyword, mood in mood_map.items():

        if keyword in lowered:
            detected_moods.append(mood)

    if detected_moods:

        trip["mood"] = " ".join(
            detected_moods
        )

    # ---------- GROUP DETECTION ----------
    if "family" in lowered:
        trip["group_type"] = "family"

    elif "couple" in lowered:
        trip["group_type"] = "couple"

    elif "solo" in lowered:
        trip["group_type"] = "solo"

    elif "friends" in lowered:
        trip["group_type"] = "friends"

    # ---------- BUDGET EXTRACTION ----------
    budget_match = re.search(
        r"(?:under|below|max|budget)\s*(?:rs\.?|₹)?\s*(\d+)",
        lowered
    )

    if budget_match:

        trip["budget"] = int(
            budget_match.group(1)
        )

    # ---------- DAYS EXTRACTION ----------
    days_match = re.search(
        r"(\d+)\s*(?:days|day)",
        lowered
    )

    if days_match:

        trip["days"] = int(
            days_match.group(1)
        )

    # ---------- SEASON DETECTION ----------
    seasons = [
        "summer",
        "winter",
        "spring",
        "monsoon",
        "autumn"
    ]

    for season in seasons:

        if season in lowered:
            trip["season"] = season
            break

    return trip


# =========================================================
# CHAT
# =========================================================

def chat():

    payload = request.get_json(
        silent=True
    ) or {}

    message = payload.get(
        "message",
        ""
    )

    trip = trip_from_payload(
        message,
        payload
    )

    answer, results = chat_answer(
        message,
        trip
    )

    return jsonify({
        "answer": answer,
        "recommendations": results
    })


# =========================================================
# STREAM CHAT
# =========================================================

def chat_stream():

    payload = request.get_json(
        silent=True
    ) or {}

    message = payload.get(
        "message",
        ""
    )

    trip = trip_from_payload(
        message,
        payload
    )

    results = recommend(
        trip,
        limit=3
    )

    def event(name, data):

        return (
            f"event: {name}\n"
            f"data: {json.dumps(data)}\n\n"
        )

    @stream_with_context
    def generate():

        yield event(
            "meta",
            {
                "status": "started",
                "recommendations": results
            }
        )

        try:

            for delta in stream_chat_answer(
                message,
                trip
            ):

                if delta:

                    yield event(
                        "delta",
                        {"text": delta}
                    )

            yield event(
                "done",
                {
                    "status": "completed",
                    "recommendations": results
                }
            )

        except Exception as exc:

            yield event(
                "error",
                {"message": str(exc)}
            )

    return Response(
        generate(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# =========================================================
# HOTELS
# =========================================================

def hotels(destination_id):

    trip = normalize_trip(
        request.get_json(silent=True) or {}
    )

    return jsonify({
        "hotels": recommend_hotels(
            destination_id,
            trip
        )
    })


# =========================================================
# HIDDEN GEMS
# =========================================================

def gems(destination_id):

    return jsonify({
        "hidden_gems": hidden_gems(destination_id)
    })


# =========================================================
# WEATHER
# =========================================================

def weather(destination_id):

    destination = next(
        (
            item
            for item in DESTINATIONS
            if item["id"] == destination_id
        ),
        DESTINATIONS[0],
    )

    return jsonify({
        "weather": weather_for(destination)
    })


# =========================================================
# REVIEWS
# =========================================================

def reviews(destination_id):

    destination = next(
        (
            item
            for item in DESTINATIONS
            if item["id"] == destination_id
        ),
        DESTINATIONS[0],
    )

    return jsonify({
        "summary": summarize_reviews(destination),
        "reviews": destination["reviews"]
    })


# =========================================================
# BUDGET
# =========================================================

def budget(destination_id):

    trip = normalize_trip(
        request.get_json(silent=True) or {}
    )

    return jsonify(
        budget_optimizer(
            destination_id,
            trip
        )
    )


# =========================================================
# CROWD
# =========================================================

def crowd(destination_id):

    trip = normalize_trip(
        request.get_json(silent=True) or {}
    )

    result = recommend(
        trip,
        limit=6
    )

    destination = next(
        (
            item
            for item in result
            if item["id"] == destination_id
        ),
        result[0]
    )

    return jsonify({
        "destination": destination["name"],
        "crowd_level": destination["crowd_level"]
    })


# =========================================================
# MAPS
# =========================================================

def maps():

    trip = normalize_trip(
        request.get_json(silent=True) or {}
    )

    results = recommend(
        trip,
        limit=3
    )

    return jsonify(
        map_payload(results)
    )


# =========================================================
# SAVE TRIP
# =========================================================

def save_current_trip():

    user_id = getattr(
        request,
        "user",
        {}
    ).get("user_id")

    payload = request.get_json(
        silent=True
    ) or {}

    saved = save_trip(
        user_id,
        payload
    )

    return jsonify({
        "saved_trip": saved
    }), 201
