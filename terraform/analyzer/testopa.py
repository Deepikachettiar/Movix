from opa_parser import run_opa
from opa_parser import load_opa
from opa_parser import summarize_opa

run_opa()

report = load_opa()

summary = summarize_opa(report)

print(summary)