from parser import (
    load_plan,
    extract_resources,
    summarize_resources
)

from cost_estimator import estimate_cost

from checkov_parser import (
    run_checkov,
    load_checkov,
    summarize_checkov
)

from opa_parser import (
    run_opa,
    load_opa,
    summarize_opa
)


# ===========================
# Terraform Parser
# ===========================

plan = load_plan()

resources = extract_resources(plan)

resource_summary = summarize_resources(resources)

cost_summary = estimate_cost(resources)


# ===========================
# Checkov
# ===========================

run_checkov()

checkov_report = load_checkov()

checkov_summary = summarize_checkov(checkov_report)


# ===========================
# OPA
# ===========================

run_opa()

opa_report = load_opa()

opa_summary = summarize_opa(opa_report)


# ===========================
# Final Analysis Object
# ===========================

analysis = {
    "resources": resource_summary,
    "cost": cost_summary,
    "checkov": checkov_summary,
    "opa": opa_summary,
}


# ===========================
# Print Results
# ===========================

import json

print("\n========== FINAL ANALYSIS ==========\n")

print(json.dumps(analysis, indent=4))