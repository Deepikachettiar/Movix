from parser import *
from cost_estimator import *
from checkov_parser import *
from opa_parser import *
from issue_prioritiser import *

from prompt_builder import *

from llm_analyzer import analyze

plan = load_plan()

resources = extract_resources(plan)

analysis = {

    "resources": summarize_resources(resources),

    "cost": estimate_cost(resources),

    "checkov": summarize_checkov(load_checkov()),

    "opa": summarize_opa(load_opa())

}

report = prioritize_issues(analysis)

prompt = build_prompt(report)

answer = analyze(prompt)

print(answer)