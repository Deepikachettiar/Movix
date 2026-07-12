import json


def build_prompt(report):

    prompt = f"""
You are a Senior AWS Cloud Architect.

Your task is to review the Terraform infrastructure analysis below.

Respond professionally.

Your report must contain:

1. Infrastructure Score (/100)

2. Production Readiness Score (/100)

3. Security Assessment

4. Cost Analysis

5. Infrastructure Strengths

6. Critical Issues

7. High Priority Improvements

8. Cost Optimization Suggestions

9. Best Practices

10. Final Recommendation

Infrastructure Analysis:

{json.dumps(report, indent=4)}

Return only the report.
"""

    return prompt