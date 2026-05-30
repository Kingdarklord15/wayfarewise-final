def generate_hotels(name):

    return [
        {
            "name": f"{name} Grand Resort",
            "price": 3500,
            "rating": 4.5,
            "type": "luxury"
        },
        {
            "name": f"{name} Comfort Stay",
            "price": 2200,
            "rating": 4.3,
            "type": "midrange"
        },
        {
            "name": f"{name} Budget Inn",
            "price": 1200,
            "rating": 4.1,
            "type": "budget"
        }
    ]


def generate_hidden_gems(name):

    return [
        f"Secret Viewpoint of {name}",
        f"Local Market of {name}",
        f"Riverside Trail in {name}"
    ]
def normalize_destination(raw):
    return {

        "id": raw.get("id", ""),

        "name": raw.get("name", ""),

        "state": raw.get("state", ""),

        "country": raw.get("country", ""),

        "lat": float(
            raw.get("lat", 0) or 0
        ),

        "lng": float(
            raw.get("lng", 0) or 0
        ),

        "tags": str(
            raw.get("tags", "")
        ).split(" | "),

        "moods": str(
            raw.get("moods", "")
        ).split(" | "),

        "groups": str(
            raw.get("groups", "")
        ).split(" | "),

        "best_seasons": str(
            raw.get("best_seasons", "")
        ).split(" | "),

        "ideal_days": str(
            raw.get("ideal_days", "")
        ).split(" | "),

        "best_starting_cities": str(
            raw.get(
                "best_starting_cities",
                ""
            )
        ).split("|"),

        "base_cost": int(
            raw.get("base_cost", 0) or 0
        ),

        "weather_profile": raw.get(
            "weather_profile",
            ""
        ),

        "popularity": int(
            raw.get("popularity", 0) or 0
        ),

        "rating": float(
            raw.get("rating", 0) or 0
        ),

        # ---------- NEW INTELLIGENCE SCORES ----------

        "nightlife_score": int(
            raw.get(
                "nightlife_score",
                0
            ) or 0
        ),

        "food_score": int(
            raw.get(
                "food_score",
                0
            ) or 0
        ),

        "adventure_score": int(
            raw.get(
                "adventure_score",
                0
            ) or 0
        ),

        "nature_score": int(
            raw.get(
                "nature_score",
                0
            ) or 0
        ),

        "luxury_score": int(
            raw.get(
                "luxury_score",
                0
            ) or 0
        ),

        "workcation_score": int(
            raw.get(
                "workcation_score",
                0
            ) or 0
        ),

        # ---------- IMAGE ----------

        "image": raw.get(
            "image",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        ),

        # ---------- DESCRIPTION ----------

        "description": raw.get(
            "description",
            ""
        ),

        # ---------- SAFE DEFAULTS ----------

        "reviews": [],

        "hidden_gems": generate_hidden_gems(
    raw.get("name", "")
),

"hotels": generate_hotels(
    raw.get("name", "")
),

        "attractions": [],

        "source": "csv"
    }