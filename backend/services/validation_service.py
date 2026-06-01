def validate_trip_request(trip):

    errors = {}

    # Budget validation
    if trip.get("budget", 0) <= 0:
        errors["budget"] = "Budget must be greater than 0"

    # Days validation
    if trip.get("days", 0) <= 0:
        errors["days"] = "Days must be greater than 0"

    # Interests validation
    interests = trip.get("interests")

    if not isinstance(interests, list):
        errors["interests"] = "Interests must be a list"

    # Group type validation
    allowed_groups = [
        "solo",
        "couple",
        "family",
        "friends"
    ]

    if trip.get("group_type") not in allowed_groups:
        errors["group_type"] = (
            f"Must be one of {allowed_groups}"
        )

    # Season validation
    allowed_seasons = [
        "summer",
        "winter",
        "spring",
        "monsoon",
        "autumn"
    ]

    if trip.get("season") not in allowed_seasons:
        errors["season"] = (
            f"Must be one of {allowed_seasons}"
        )

    return errors