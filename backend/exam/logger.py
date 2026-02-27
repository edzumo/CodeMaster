import os
import time
from django.conf import settings

ATTEMPT_DIR = os.path.join(settings.BASE_DIR, "attempts")
RESULT_FILE = os.path.join(settings.BASE_DIR, "results.csv")

os.makedirs(ATTEMPT_DIR, exist_ok=True)

def save_attempt(name, qid, code):
    filename = f"{name}_{qid}_{int(time.time())}.txt"
    path = os.path.join(ATTEMPT_DIR, filename)

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)

def append_result(row):
    with open(RESULT_FILE, "a", encoding="utf-8") as f:
        f.write(row + "\n")