import re

from services.data_service import DESTINATIONS

from services.embedding_service import (
    embedding_similarity
)


WEIGHTS = {
    "interest": 4.0,
    "mood": 2.4,
    "group": 1.2,
    "budget": 2.0,
    "season": 1.0,
    "days": 0.8,
    "history": 1.0,
    "embedding": 2.2,
}


def words(value):

    if isinstance(value, list):
        value = " ".join(
            str(item)
            for item in value
        )

    return [
        item.strip().lower()
        for item in re.split(
            r"[,/| ]+",
            str(value or "")
        )
        if item.strip()
    ]


def parse_budget(value):

    if isinstance(value, (int, float)):
        return int(value)

    text = str(
        value or "15000"
    ).lower()

    match = re.search(
        r"([0-9,]+)\s*k",
        text
    )

    if match:

        return int(
            match.group(1)
            .replace(",", "")
        ) * 1000

    digits = re.sub(
        r"[^0-9]",
        "",
        text
    )

    return int(digits or 15000)


def parse_days(value):

    if isinstance(value, (int, float)):
        return max(1, int(value))

    match = re.search(
        r"\d+",
        str(value or "3")
    )

    return (
        int(match.group())
        if match else 3
    )


def normalize_trip(payload):

    interests = payload.get(
        "interests",
        ["mountains", "cafes"]
    )

    if isinstance(interests, str):
        interests = words(interests)

    return {
        "from_city": str(
            payload.get("from_city")
            or payload.get("from")
            or "Delhi"
        ),

        "budget": parse_budget(
            payload.get("budget", 15000)
        ),

        "days": parse_days(
            payload.get("days", 3)
        ),

        "interests": interests,

        "season": str(
            payload.get("season", "winter")
        ).lower(),

        "group_type": str(
            payload.get("group_type")
            or payload.get("group")
            or "friends"
        ).lower(),

        "mood": str(
            payload.get("mood", "relaxing")
        ).lower(),

        "hotel_type": str(
            payload.get("hotel_type", "budget")
        ).lower(),
    }


def budget_match(
    destination_cost,
    user_budget
):

    if destination_cost <= user_budget:
        return 1.0

    over_budget_ratio = (
        destination_cost - user_budget
    ) / max(user_budget, 1)

    return max(
        0.0,
        1.0 - over_budget_ratio
    )


def crowd_level(
    destination,
    trip
):

    crowd = destination["popularity"]

    if trip["season"] in [
        "summer",
        "winter"
    ]:
        crowd += 8

    if trip["days"] <= 2:
        crowd += 4

    if crowd >= 85:
        return "High"

    if crowd >= 60:
        return "Medium"

    return "Low"


def weather_score(
    destination,
    trip
):

    return (
        1.0
        if trip["season"]
        in destination["best_seasons"]
        else 0.55
    )


def cost_breakdown(
    destination,
    trip
):

    total = int(
        destination["base_cost"]
        * (max(trip["days"], 1) / 3)
    )

    return {
        "travel": int(total * 0.34),
        "stay": int(total * 0.30),
        "food": int(total * 0.22),
        "activities": int(total * 0.14),
        "total": total,

        "savings_tip":
        "Use overnight transport and homestays to reduce stay and travel overlap.",
    }


def score_destination(
        
    destination,
    trip,
    user_history=None
):

    user_history = user_history or []

    interests = {
    str(x).strip().lower()
    for x in trip["interests"]
    }

    tags = {
    str(x).strip().lower()
    for x in destination["tags"]
    }

    groups = {
    str(x).strip().lower()
    for x in destination["groups"]
    } 

    # ---------- MOOD PROCESSING ----------
    destination_moods = set()

    for mood in destination["moods"]:

        destination_moods.update(
            words(mood)
        )

    trip_moods = set(
        words(trip["mood"])
    )

    mood_overlap = (
        trip_moods &
        destination_moods
    )

    mood_score = len(
        mood_overlap
    ) / max(len(trip_moods), 1)



    if mood_score == 0:
        mood_score = -0.8



    interest_score = len(
        interests & tags
    ) / max(len(interests), 1)

    # ---------- HARD INTEREST PENALTY ----------
    if len(interests & tags) == 0:
        interest_score = -1.5

    # ---------- GROUP SCORE ----------
    group_score = (
        1.0
        if trip["group_type"] in groups
        else 0.25
    )

    # ---------- BUDGET ----------
    budget_score = budget_match(
        destination["base_cost"],
        trip["budget"]
    )

    # ---------- SEASON ----------
    season_score = weather_score(
        destination,
        trip
    )

    # ---------- DAYS ----------
    days_score = (
        1.0
        if trip["days"]
        in destination["ideal_days"]
        else 0.65
    )

    # ---------- HISTORY ----------
    history_score = 0.0

    if any(
        tag in " ".join(user_history).lower()
        for tag in tags
    ):
        history_score = 1.0

    # ---------- SEMANTIC ----------
    semantic_score, embedding_source = (
        embedding_similarity(
            destination,
            trip
        )
    )

    # ---------- START CITY BOOST ----------
    start_city_score = 0.0

    best_cities = set(
        words(
            destination.get(
                "best_starting_cities",
                []
            )
        )
    )

    if (
        trip["from_city"].lower()
        in best_cities
    ):
        start_city_score = 1.0


    # ---------- FINAL WEIGHTS ----------
    raw_score = (

        interest_score * 2.5

        + mood_score * 3.0

        + group_score * 2.0

        + budget_score * 4.0

        + season_score * 3.0

        + days_score * 1.0

        + history_score * 0.0

        + semantic_score * 0.1

        + start_city_score * 15.0
    )

     # ---------- INTELLIGENCE SCORES ----------

    if trip["mood"] == "party":

        raw_score += (
            destination.get(
                "nightlife_score",
                0
            ) * 0.5
        )

    if trip["mood"] == "luxury":

        raw_score += (
            destination.get(
                "luxury_score",
                0
            ) * 0.5
        )

    if trip["mood"] == "adventurous":

        raw_score += (
            destination.get(
                "adventure_score",
                0
            ) * 0.5
        )

    if trip["mood"] == "relaxing":

        raw_score += (
            destination.get(
                "nature_score",
                0
            ) * 0.4
        )

    if (
        "food" in trip["interests"]
        or "cafes" in trip["interests"]
    ):

        raw_score += (
            destination.get(
                "food_score",
                0
            ) * 0.3
        )

    final_score = max(
        0,
        round(raw_score * 10, 1)
    )

    return {
        "score": final_score,

        "semantic_score": round(
            semantic_score * 100,
            1
        ),

        "embedding_source":
        embedding_source,
    }

def explain(
    destination,
    trip,
    score,
    semantic_score
):

    matched = sorted(
        set(trip["interests"])
        & set(destination["tags"])
    )

    matched_text = (
        ", ".join(matched)
        if matched
        else "your travel style"
    )

    return (
        f"{destination['name']} is a {score}% match because it fits {matched_text}, "
        f"works for {trip['group_type']} travel, "
        f"has {destination['weather_profile'].lower()}, "
        f"can be planned around Rs. "
        f"{cost_breakdown(destination, trip)['total']:,}, "
        f"and has a {semantic_score}% semantic similarity to your travel intent."
    )


def recommend(
    trip,
    user_history=None,
    limit=6
):

    results = []

    for destination in DESTINATIONS:

        score_data = score_destination(
            destination,
            trip,
            user_history
        )

        score = score_data["score"]

        results.append({

            **destination,

            "match_score": score,

            "semantic_score":
            score_data["semantic_score"],

            "embedding_source":
            score_data["embedding_source"],

            "crowd_level":
            crowd_level(destination, trip),

            "estimated_cost":
            cost_breakdown(destination, trip),

            "why_recommended":
            explain(
                destination,
                trip,
                score,
                score_data["semantic_score"]
            ),

            "weather_suggestion":
            weather_suggestion(
                destination,
                trip
            ),

            "review_summary":
            summarize_reviews_fallback(
                destination
            ),
        })

    return sorted(
        results,
        key=lambda item:
        item["match_score"],
        reverse=True
    )[:limit]


def recommend_hotels(
        destination_id,
        trip
    ):

        destination = next(
            (
                item
                for item in DESTINATIONS
                if item["id"] == destination_id
            ),
            DESTINATIONS[0]
        )

        hotel_type = trip.get(
            "hotel_type",
            "budget"
        )

        hotels = []

        for hotel in destination["hotels"]:

            match = 84

            if hotel["type"] == hotel_type:
                match = 96

            elif hotel["price"] <= (
                trip["budget"]
                / max(trip["days"], 1)
                * 0.4
            ):
                match = 90

            hotels.append({
                **hotel,
                "match_score": match,
                "destination": destination["name"]
            })

        return sorted(
            hotels,
            key=lambda item:
            item["match_score"],
            reverse=True
        )


def hidden_gems(destination_id):

        destination = next(
            (
                item
                for item in DESTINATIONS
                if item["id"] == destination_id
            ),
            DESTINATIONS[0]
        )

        return [
            {
                "name": gem,

                "reason":
                "Recommended because it has lower crowd pressure and strong local experience value.",

                "crowd":
                "Low"
                if index != 0
                else "Medium",
            }

            for index, gem
            in enumerate(
                destination["hidden_gems"]
            )
        ]


def summarize_reviews_fallback(
    destination
):

    return (
        f"Travelers loved "
        f"{destination['tags'][0]}, "
        f"{destination['tags'][1]}, "
        f"and the overall vibe. "
        f"The main caution is crowd level around peak season or weekends."
    )


def weather_suggestion(
    destination,
    trip
):

    if (
        trip["season"]
        in destination["best_seasons"]
    ):

        return (
            f"{trip['season'].title()} "
            f"is a good season for "
            f"{destination['name']}."
        )

    return (
        f"Weather may be less ideal in "
        f"{trip['season']}; "
        f"keep backup indoor cafes "
        f"or shorter travel windows."
    )


def budget_optimizer(
    destination_id,
    trip
):

    destination = next(
        (
            item
            for item in DESTINATIONS
            if item["id"] == destination_id
        ),
        DESTINATIONS[0]
    )

    breakdown = cost_breakdown(
        destination,
        trip
    )

    remaining = (
        trip["budget"]
        - breakdown["total"]
    )

    return {
        "destination":
        destination["name"],

        "budget":
        trip["budget"],

        "breakdown":
        breakdown,

        "remaining":
        remaining,

        "status":
        "within_budget"
        if remaining >= 0
        else "over_budget",

        "tips": [
            "Choose weekday stays for lower hotel prices.",
            "Use shared transport where possible.",
            "Keep one paid activity per day and fill the rest with local walks or viewpoints.",
        ],
    }