from checkov_parser import run_checkov
from checkov_parser import load_checkov
from checkov_parser import summarize_checkov

run_checkov()

report = load_checkov()

summary = summarize_checkov(report)

print(summary)