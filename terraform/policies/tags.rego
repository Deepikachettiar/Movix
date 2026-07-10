package terraform.tags

required_tags := {
    "Environment",
    "Project",
    "Owner"
}

deny contains msg if {
    resource := input.resource_changes[_]

    tags := resource.change.after.tags

    tags == null

    msg := sprintf(
        "Resource %s has no tags defined.",
        [resource.address]
    )
}

deny contains msg if {
    resource := input.resource_changes[_]

    tags := resource.change.after.tags

    tags != null

    required := required_tags[_]

    not tags[required]

    msg := sprintf(
        "Resource %s is missing required tag '%s'.",
        [resource.address, required]
    )
}