from parser import load_plan, extract_resources, summarize_resources
from cost_estimator import estimate_cost

plan = load_plan()

resources = extract_resources(plan)

print("===== RESOURCE SUMMARY =====")
print(summarize_resources(resources))

print()

print("===== ESTIMATED COST =====")
print(estimate_cost(resources))