terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Call the VPC Module
module "movix_network" {
  source   = "./modules/vpc"
  env_name = "movix-prod"
}

# 2. Call the EKS Module (NEW)
module "movix_cluster" {
  source = "./modules/eks"
  
  # Passing the outputs from the VPC module into the EKS module
  env_name           = "movix-prod"
  vpc_id             = module.movix_network.vpc_id
  private_subnet_ids = module.movix_network.private_subnet_ids
}