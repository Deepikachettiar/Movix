# this is the root caller to all modules


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

# Calling our custom VPC network structure module
module "movix_network" {
  source = "./modules/vpc"
  
  # Override variable configuration if necessary, or let defaults execute
  env_name = "movix-prod-infrastructure"
}