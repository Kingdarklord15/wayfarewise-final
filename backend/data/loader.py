import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def load_destinations():
    file_path = BASE_DIR / "expanded_destinations.csv"

    df = pd.read_csv(file_path)

    return df.to_dict(orient="records") 