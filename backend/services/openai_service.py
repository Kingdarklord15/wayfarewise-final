import json
import time

from openai import OpenAI

from config.settings import Config
from services.recommendation_service import recommend, summarize_reviews_fallback


def client():
    if not Config.OPENAI_API_KEY:
        return None
    return OpenAI(api_key=Config.OPENAI_API_KEY)


def ai_text(prompt, fallback):
    openai_client = client()
    if openai_client is None:
        return fallback
    try:
        response = openai_client.responses.create(
            model=Config.OPENAI_MODEL,
            instructions="You are a concise expert WayfareWise. Return practical, specific advice.",
            input=prompt,
            max_output_tokens=600,
        )
        return response.output_text.strip()
    except Exception:
        return fallback


def chat_answer(message, trip):
    recommendations = recommend(trip, limit=3)
    prompt = chat_prompt(
    message,
    recommendations,
    trip
)
    fallback = chat_fallback(recommendations)
    return ai_text(prompt, fallback), recommendations


def chat_prompt(message, recommendations, trip):

    summary = []

    for item in recommendations:

        summary.append(
            f"""
Destination: {item['name']}
Tags: {', '.join(item['tags'])}
Match Score: {item['match_score']}%
Budget Estimate: Rs. {item['estimated_cost']['total']}
Crowd Level: {item['crowd_level']}
Why Recommended: {item['why_recommended']}
Hidden Gems: {', '.join(item['hidden_gems'])}
"""
        )

    return f"""
You are WayfareWise AI, an intelligent travel recommendation assistant.

User Request:
{message}

User Preferences:
- From City: {trip['from_city']}
- Budget: Rs. {trip['budget']}
- Mood: {trip['mood']}
- Interests: {', '.join(trip['interests'])}
- Group Type: {trip['group_type']}
- Season: {trip['season']}
- Hotel Style: {trip['hotel_type']}

Top Recommended Destinations:
{''.join(summary)}

Instructions:
- Explain WHY each destination matches.
- Mention vibe differences.
- Mention weather suitability.
- Mention budget fit.
- Mention hidden gems.
- Compare destinations naturally.
- Avoid generic travel advice.
- Avoid repetitive phrasing.
- Sound like an intelligent AI travel planner.

Keep response practical, specific, and conversational.
"""


def chat_fallback(recommendations):

    lines = []

    for item in recommendations:

        lines.append(
            f"""
{item['name']} ({item['match_score']}% match)

Why:
{item['why_recommended']}

Hidden Gems:
{', '.join(item['hidden_gems'])}

Estimated Budget:
Rs. {item['estimated_cost']['total']}
"""
        )

    return "\n".join(lines)


def stream_chat_answer(message, trip):
    recommendations = recommend(trip, limit=3)
    prompt = chat_prompt(
    message,
    recommendations,
    trip
)
    fallback = chat_fallback(recommendations)
    openai_client = client()

    if openai_client is None:
        for chunk in fallback.split(" "):
            yield chunk + " "
            time.sleep(0.025)
        return recommendations

    try:
        stream = openai_client.responses.create(
            model=Config.OPENAI_MODEL,
            instructions="You are a concise expert WayfareWise. Return practical, specific advice.",
            input=prompt,
            max_output_tokens=600,
            stream=True,
        )
        for event in stream:
            if getattr(event, "type", "") == "response.output_text.delta":
                yield event.delta
    except Exception:
        for chunk in fallback.split(" "):
            yield chunk + " "
            time.sleep(0.025)

    return recommendations


def generate_itinerary(destination, trip):

    fallback = []

    tags = destination.get("tags", [])

    for day in range(trip["days"]):

        tag = (
            tags[day % len(tags)]
            if tags
            else destination["name"]
        )

        fallback.append({
            "day": day + 1,
            "title": f"Explore {destination['name']}",
            "morning": (
                f"Start the day exploring experiences related to "
                f"{tag} in {destination['name']}."
            ),
            "afternoon": (
                f"Discover popular local attractions and enjoy the culture "
                f"of {destination['name']}."
            ),
            "evening": (
                f"Enjoy local food, photography and relaxation in "
                f"{destination['name']}."
            )
        })

    prompt = (
        f"Create a {trip['days']}-day itinerary for {destination['name']} from {trip['from_city']}.\n"
        f"Budget: Rs. {trip['budget']}. Interests: {', '.join(trip['interests'])}. Mood: {trip['mood']}.\n"
        "Return JSON array only with day, title, morning, afternoon, evening."
    )

    text = ai_text(prompt, json.dumps(fallback))

    try:
        return json.loads(text)
    except Exception:
        return fallback     
def summarize_reviews(destination):

    fallback = summarize_reviews_fallback(destination)

    prompt = (
            f"Summarize these travel reviews for {destination['name']} in one sentence:\n"
            f"{json.dumps(destination.get('reviews', []))}"
        )

    return ai_text(prompt, fallback)