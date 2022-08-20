provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region

  default_tags {
    tags = {
      Created_by = "Terraform"
      Project    = var.project_name
      Stage      = var.project_stg
    }
  }
}

data "aws_caller_identity" "current" {}

module "resource_groups" {
  source       = "./modules/ResourceGroups"
  project_name = var.project_name
  project_stg  = var.project_stg
}

module "networking" {
  source                      = "./modules/Networking"
  project_name                = var.project_name
  project_stg                 = var.project_stg
  vpc_cidr                    = var.vpc_cidr
  public_subnet_general_cidrs = var.public_subnet_general_cidrs
  private_subnet_rds_cidrs    = var.private_subnet_rds_cidrs
  count_of_public_nats        = var.count_of_public_nats
}

module "amplify" {
  source                              = "./modules/Amplify"
  project_name                        = var.project_name
  project_stg                         = var.project_stg
  github_account_name                 = var.github_account_name
  github_repository_name_amplify      = var.github_repository_name_amplify
  github_access_token_amplify         = var.github_access_token_amplify
  amplify_github_branch_name_dev      = var.amplify_github_branch_name_dev
  amplify_domain_name                 = var.amplify_domain_name
  amplify_staging_basic_auth_username = var.amplify_staging_basic_auth_username
  amplify_staging_basic_auth_password = var.amplify_staging_basic_auth_password

  # App Environment Variables
  next_public_app_env          = var.next_public_app_env
  next_public_graphql_endpoint = var.next_public_graphql_endpoint
}
