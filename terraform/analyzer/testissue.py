import json

from parser import *
from cost_estimator import *
from checkov_parser import *
from opa_parser import *
from issue_prioritiser import *

plan = load_plan()

resources = extract_resources(plan)

analysis = {

    "resources": summarize_resources(resources),

    "cost": estimate_cost(resources),

    "checkov": summarize_checkov(load_checkov()),

    "opa": summarize_opa(load_opa())

}

report = prioritize_issues(analysis)

print(json.dumps(report, indent=4))