package terraform.encryption

deny contains msg if {
    resource := input.resource_changes[_]

    resource.type == "aws_eks_cluster"

    count(resource.change.after.encryption_config) == 0

    msg := sprintf(
        "EKS Cluster %s does not enable secrets encryption.",
        [resource.address]
    )
}