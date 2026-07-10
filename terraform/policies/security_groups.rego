package terraform.securitygroups

deny contains msg if {
    resource := input.resource_changes[_]

    resource.type == "aws_default_security_group"

    count(resource.change.after.ingress) > 0

    msg := sprintf(
        "Default Security Group %s contains ingress rules.",
        [resource.address]
    )
}