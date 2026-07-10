import json

from config import PLAN_FILE


def load_plan():
    with open(PLAN_FILE, "r") as f:
        return json.load(f)


def extract_resources(plan):

    resources = []

    for resource in plan["resource_changes"]:

        resources.append(
            {
                "address": resource.get("address"),
                "type": resource.get("type"),
                "action": resource["change"]["actions"][0],
                "configuration": resource["change"]["after"],
            }
        )

    return resources


def summarize_resources(resources):

    summary = {}

    for resource in resources:

        resource_type = resource["type"]

        summary[resource_type] = summary.get(resource_type, 0) + 1

    return summary