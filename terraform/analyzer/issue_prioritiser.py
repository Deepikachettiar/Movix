def prioritize_issues(analysis):

    report = {
        "critical": [],
        "high": [],
        "medium": [],
        "low": [],
        "summary": {}
    }

    # -----------------------------
    # Cost Analysis
    # -----------------------------

    if analysis["cost"]["total"] > 100:

        report["high"].append({

            "severity": "High",

            "category": "Cost",

            "title": "High Estimated Monthly Cost",

            "description":
                f"Estimated AWS monthly cost is ${analysis['cost']['total']:.2f}.",

            "recommendation":
                "Reduce NAT Gateways, downsize EC2/EKS instances, or use Spot Instances."
        })

    # -----------------------------
    # Checkov
    # -----------------------------

    checkov = analysis["checkov"]

    if checkov["failed"] > 0:

        report["high"].append({

            "severity": "High",

            "category": "Security",

            "title": "Infrastructure Security Checks Failed",

            "description":
                f"{checkov['failed']} Checkov policies failed.",

            "recommendation":
                "Review failed Checkov findings and fix security issues before deployment."
        })

    # -----------------------------
    # OPA - EKS
    # -----------------------------

    for violation in analysis["opa"]["eks"]["violations"]:

        report["critical"].append({

            "severity": "Critical",

            "category": "EKS",

            "title": "Public Kubernetes API",

            "description": violation,

            "recommendation":
                "Disable endpoint_public_access or restrict public_access_cidrs."
        })

    # -----------------------------
    # OPA - Tags
    # -----------------------------

    if analysis["opa"]["tags"]["count"] > 0:

        report["medium"].append({

            "severity": "Medium",

            "category": "Governance",

            "title": "Missing Resource Tags",

            "description":
                f"{analysis['opa']['tags']['count']} tag violations detected.",

            "recommendation":
                "Apply mandatory tags such as Environment, Project and Owner."
        })

    # -----------------------------
    # OPA - IAM
    # -----------------------------

    for violation in analysis["opa"]["iam"]["violations"]:

        report["high"].append({

            "severity": "High",

            "category": "IAM",

            "title": "IAM Policy Violation",

            "description": violation,

            "recommendation":
                "Follow least privilege principle and remove excessive permissions."
        })

    # -----------------------------
    # OPA - Networking
    # -----------------------------

    for violation in analysis["opa"]["network"]["violations"]:

        report["high"].append({

            "severity": "High",

            "category": "Networking",

            "title": "Networking Policy Violation",

            "description": violation,

            "recommendation":
                "Review VPC, subnet and routing configuration."
        })

    # -----------------------------
    # OPA - Security Groups
    # -----------------------------

    for violation in analysis["opa"]["securitygroups"]["violations"]:

        report["critical"].append({

            "severity": "Critical",

            "category": "Security Groups",

            "title": "Overly Permissive Security Group",

            "description": violation,

            "recommendation":
                "Restrict inbound ports and avoid 0.0.0.0/0 wherever possible."
        })

    # -----------------------------
    # OPA - Encryption
    # -----------------------------

    for violation in analysis["opa"]["encryption"]["violations"]:

        report["high"].append({

            "severity": "High",

            "category": "Encryption",

            "title": "Encryption Disabled",

            "description": violation,

            "recommendation":
                "Enable encryption using AWS KMS."
        })

    # -----------------------------
    # OPA - Region
    # -----------------------------

    for violation in analysis["opa"]["region"]["violations"]:

        report["medium"].append({

            "severity": "Medium",

            "category": "Region",

            "title": "Region Policy Violation",

            "description": violation,

            "recommendation":
                "Deploy resources only in approved regions."
        })

    # -----------------------------
    # OPA - Instance Types
    # -----------------------------

    for violation in analysis["opa"]["instance"]["violations"]:

        report["medium"].append({

            "severity": "Medium",

            "category": "Compute",

            "title": "Unsupported Instance Type",

            "description": violation,

            "recommendation":
                "Use only approved Free Tier instance types."
        })

    # -----------------------------
    # Summary
    # -----------------------------

    report["summary"] = {

        "resource_count": sum(analysis["resources"].values()),

        "resource_breakdown": analysis["resources"],

        "estimated_cost": analysis["cost"]["total"],

        "checkov_passed": checkov["passed"],

        "checkov_failed": checkov["failed"],

        "critical_count": len(report["critical"]),

        "high_count": len(report["high"]),

        "medium_count": len(report["medium"]),

        "low_count": len(report["low"])
    }

    return report