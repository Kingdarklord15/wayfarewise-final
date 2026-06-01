def map_payload(destinations):
    markers = []
    for destination in destinations:
        markers.append(
            {
                "id": destination["id"],
                "name": destination["name"],
                "lat": destination["lat"],
                "lng": destination["lng"],
                "type": "destination",
                "score": destination.get("match_score", destination.get("rating", 4.5)),
            }
        )
        for index, attraction in enumerate(destination.get("attractions", [])[:2]):
            markers.append(
                {
                    "id": f"{destination['id']}-attraction-{index}",
                    "name": attraction,
                    "lat": destination["lat"] + 0.02 * (index + 1),
                    "lng": destination["lng"] - 0.02 * (index + 1),
                    "type": "attraction",
                    "score": 4.4,
                }
            )
    return {
        "center": {
            "lat": destinations[0]["lat"] if destinations else 28.6139,
            "lng": destinations[0]["lng"] if destinations else 77.2090,
        },
        "markers": markers,
        "route": markers[:4],
    }
