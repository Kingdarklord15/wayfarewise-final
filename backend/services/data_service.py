from data.loader import load_destinations
from data.schema import normalize_destination

DESTINATIONS = [
    normalize_destination(d)
    for d in load_destinations()
]
print(f"Loaded {len(DESTINATIONS)} destinations")