from pricing import INSTANCE_PRICES
from pricing import SERVICE_PRICES


def estimate_cost(resources):

    total = 0

    breakdown = []

    for resource in resources:

        resource_type = resource["type"]

        if resource_type in SERVICE_PRICES:

            cost = SERVICE_PRICES[resource_type]

            total += cost

            breakdown.append(
                {
                    "resource": resource_type,
                    "monthly_cost": cost,
                }
            )

        if resource_type == "aws_eks_node_group":

            instances = resource["configuration"].get("instance_types", [])

            for instance in instances:

                if instance in INSTANCE_PRICES:

                    cost = INSTANCE_PRICES[instance]

                    total += cost

                    breakdown.append(
                        {
                            "resource": instance,
                            "monthly_cost": cost,
                        }
                    )

    return {
        "total": total,
        "breakdown": breakdown,
    }