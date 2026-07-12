import json
import subprocess
from config import CHECKOV_FILE, BASE_DIR


def run_checkov():

    command = [
        "checkov",
        "-d",
        str(BASE_DIR),
        "-o",
        "json"
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    with open(CHECKOV_FILE, "w") as file:
        file.write(result.stdout)

    print("✔ Checkov Scan Completed")


def load_checkov():

    with open(CHECKOV_FILE) as file:
        return json.load(file)[0]


def summarize_checkov(report):

    summary = report["summary"]

    return {
        "passed": summary["passed"],
        "failed": summary["failed"],
        "skipped": summary["skipped"],
        "parsing_errors": summary["parsing_errors"]
    }