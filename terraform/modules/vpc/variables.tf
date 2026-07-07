# global configurations like regions and CIDR blocks are stoed here

variable "vpc_cidr" {
  type        = string
  description = "The IP range for our custom VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "IP chunks allocated for our public subnets (where the Load Balancer lives)"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "IP chunks allocated for our private subnets (where EKS nodes and MongoDB live)"
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "availability_zones" {
  type        = list(string)
  description = "The target AWS locations to distribute our resources across for high availability"
  default     = ["us-east-1a", "us-east-1b"]
}

variable "env_name" {
  type        = string
  description = "Environment tag name suffix"
  default     = "movix-sandbox"
}