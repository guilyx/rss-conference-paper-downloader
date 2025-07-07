import os
import requests
from typing import List

# Category configuration
CATEGORIES = [
    {"category_id": 1, "category": "Perception and Navigation", "id_range": [1, 9]},
    {"category_id": 2, "category": "VLA Models", "id_range": [10, 19]},
    {"category_id": 3, "category": "Scaling Robot Learning", "id_range": [20, 28]},
    {"category_id": 4, "category": "Perception", "id_range": [29, 42]},
    {"category_id": 5, "category": "Planning", "id_range": [43, 51]},
    {"category_id": 6, "category": "Manipulation I", "id_range": [52, 60]},
    {"category_id": 7, "category": "Humanoids", "id_range": [61, 70]},
    {"category_id": 8, "category": "Imitation Learning I", "id_range": [71, 79]},
    {"category_id": 9, "category": "HRI", "id_range": [80, 93]},
    {"category_id": 10, "category": "Multi-Robot Systems", "id_range": [94, 102]},
    {"category_id": 11, "category": "Manipulation II", "id_range": [103, 111]},
    {"category_id": 12, "category": "Control and Dynamics", "id_range": [112, 121]},
    {"category_id": 13, "category": "Mobile Manipulation and Locomotion", "id_range": [122, 130]},
    {"category_id": 14, "category": "Robot Design", "id_range": [131, 135]},
    {"category_id": 15, "category": "Navigation", "id_range": [136, 144]},
    {"category_id": 16, "category": "Manipulation III", "id_range": [145, 154]},
    {"category_id": 17, "category": "Imitation Learning II", "id_range": [155, 163]}
]

BASE_URL = "https://www.roboticsproceedings.org/rss21"
OUTPUT_DIR = "rss2025_papers"

def download_paper(paper_id: int, category_name: str):
    filename = f"p{paper_id:03}.pdf"
    url = f"{BASE_URL}/{filename}"
    category_dir = os.path.join(OUTPUT_DIR, category_name.replace(" ", "_"))
    os.makedirs(category_dir, exist_ok=True)
    filepath = os.path.join(category_dir, filename)

    if os.path.exists(filepath):
        print(f"[SKIP] {filename} already exists.")
        return

    response = requests.get(url)
    if response.status_code == 200:
        with open(filepath, "wb") as f:
            f.write(response.content)
        print(f"[OK] Downloaded {filename}")
    else:
        print(f"[FAIL] Failed to download {filename}: HTTP {response.status_code}")

def download_by_category_ids(category_ids: List[int]):
    selected_categories = [c for c in CATEGORIES if c["category_id"] in category_ids]
    for category in selected_categories:
        print(f"\n--- Downloading {category['category']} ---")
        for pid in range(category["id_range"][0], category["id_range"][1] + 1):
            download_paper(pid, category["category"])

def download_all():
    all_ids = [c["category_id"] for c in CATEGORIES]
    download_by_category_ids(all_ids)

# Example usage:
if __name__ == "__main__":
    # To download a specific category (e.g., 1 and 2)
    download_by_category_ids([1, 2, 3, 4,5,7, 8, 11])

    # To download all papers
    # download_all()
