variable "env_name" {
  type        = string
  description = "Environment tag name suffix"
}

variable "vpc_id" {
  type        = string
  description = "The ID of the VPC where the cluster will be deployed"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for the EKS worker nodes"
}