package terraform.iam

deny contains msg if {
    resource := input.resource_changes[_]

    resource.type == "aws_iam_role"

    resource.change.after.max_session_duration > 43200

    msg := sprintf(
        "IAM Role %s exceeds maximum session duration.",
        [resource.address]
    )
}