package terraform.network

deny contains msg if {
    resource := input.resource_changes[_]

    resource.type == "aws_subnet"

    startswith(resource.change.after.cidr_block, "192.")

    msg := sprintf(
        "Subnet %s uses an unapproved CIDR.",
        [resource.address]
    )
}