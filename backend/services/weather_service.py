import hashlib


def weather_for(destination):
    seed = int(hashlib.sha1(destination["id"].encode()).hexdigest(), 16)
    temp = 8 + seed % 18
    condition = ["Clear", "Partly cloudy", "Cool breeze", "Light haze"][seed % 4]
    return {
        "destination": destination["name"],
        "temperature_c": temp,
        "condition": condition,
        "forecast": [
            {"day": "Today", "temperature_c": temp, "condition": condition},
            {"day": "Tomorrow", "temperature_c": temp + 1, "condition": "Clear"},
            {"day": "Day 3", "temperature_c": temp - 1, "condition": "Partly cloudy"},
        ],
        "suggestion": "Start outdoor activities early and keep evenings for cafes or local markets.",
    }
