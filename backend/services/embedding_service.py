import math

from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")

_destination_embedding_cache = {}


def normalize(vector):
    length = math.sqrt(sum(value * value for value in vector))

    if length == 0:
        return vector

    return [value / length for value in vector]


def cosine_similarity(left, right):
    if not left or not right:
        return 0.0

    size = min(len(left), len(right))

    return sum(
        left[index] * right[index]
        for index in range(size)
    )


def destination_profile(destination):
    parts = [
        destination["name"],
        destination["state"],
        destination["country"],
        destination["description"],
        destination["weather_profile"],
        "tags " + " ".join(destination["tags"]),
        "moods " + " ".join(destination["moods"]),
        "groups " + " ".join(destination["groups"]),
        "hidden gems " + " ".join(destination["hidden_gems"]),
        "attractions " + " ".join(destination["attractions"]),
        "reviews " + " ".join(destination["reviews"]),
    ]

    return ". ".join(parts)


def trip_profile(trip):
    return (
        f"Trip from {trip['from_city']} for {trip['days']} days. "
        f"Budget Rs. {trip['budget']}. "
        f"Interests: {', '.join(trip['interests'])}. "
        f"Mood: {trip['mood']}. "
        f"Group type: {trip['group_type']}. "
        f"Season: {trip['season']}. "
        f"Hotel style: {trip['hotel_type']}."
    )


def embed_text(text):
    vector = model.encode(text).tolist()

    return normalize(vector), "sentence-transformer"


def embed_destination(destination):
    cache_key = destination["id"]

    if cache_key in _destination_embedding_cache:
        return _destination_embedding_cache[cache_key]

    vector, source = embed_text(
        destination_profile(destination)
    )

    _destination_embedding_cache[cache_key] = (
        vector,
        source
    )

    return vector, source


def embedding_similarity(destination, trip):
    query_vector, query_source = embed_text(
        trip_profile(trip)
    )

    destination_vector, destination_source = embed_destination(
        destination
    )

    raw_similarity = cosine_similarity(
        query_vector,
        destination_vector
    )

    normalized_score = max(
        0.0,
        min(1.0, (raw_similarity + 1) / 2)
    )

    return round(normalized_score, 4), "sentence-transformer"


def semantic_similarity(query, text):
    query_vector, _ = embed_text(query)

    text_vector, _ = embed_text(text)

    similarity = cosine_similarity(
        query_vector,
        text_vector
    )

    return similarity, "sentence-transformer"