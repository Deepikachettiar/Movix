package terraform.region

allowed_regions := {
    "us-east-1a",
    "us-east-1b"
}

deny contains msg if {
    resource := input.resource_changes[_]

    resource.type == "aws_subnet"

    az := resource.change.after.availability_zone

    not allowed_regions[az]

    msg := sprintf(
        "Availability Zone %s is not approved.",
        [az]
    )
}