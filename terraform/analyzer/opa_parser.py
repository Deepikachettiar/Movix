import json
import subprocess

from config import OPA_FILE


def run_opa():

    command = [
        "opa",
        "eval",
        "-i",
        "../plan.json",
        "-d",
        "../policies",
        "data.terraform"
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    with open(OPA_FILE, "w") as file:
        file.write(result.stdout)

    print("✔ OPA Evaluation Completed")


def load_opa():

    with open(OPA_FILE) as file:
        return json.load(file)

def summarize_opa(report):

    policies = report["result"][0]["expressions"][0]["value"]

    summary = {}

    for policy_name, policy_data in policies.items():

        summary[policy_name] = {
            "count": len(policy_data["deny"]),
            "violations": policy_data["deny"]
        }

    return summary 