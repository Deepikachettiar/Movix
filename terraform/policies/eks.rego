package terraform.eks

deny contains msg if {
    resource := input.resource_changes[_]

    resource.type == "aws_eks_cluster"

    resource.change.after.vpc_config[0].endpoint_public_access

    msg := sprintf(
        "EKS Cluster %s has public endpoint enabled.",
        [resource.address]
    )
}