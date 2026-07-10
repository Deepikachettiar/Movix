package terraform.instance

allowed_instance_types := {
    "t3.micro",
    "t3.small",
    "t3.medium"
}

deny contains msg if {
    resource := input.resource_changes[_]

    resource.type == "aws_eks_node_group"

    instance := resource.change.after.instance_types[_]

    not allowed_instance_types[instance]

    msg := sprintf(
        "Instance type %s is not approved by company policy.",
        [instance]
    )
}