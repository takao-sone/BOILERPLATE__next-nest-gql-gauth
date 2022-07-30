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

module "amplify" {
  source                         = "./modules/Amplify"
  project_name                   = var.project_name
  project_stg                    = var.project_stg
  github_account_name            = var.github_account_name
  github_repository_name_amplify = var.github_repository_name_amplify
  github_access_token_amplify    = var.github_access_token_amplify
  amplify_github_branch_name_dev = var.amplify_github_branch_name_dev
  amplify_domain_name            = var.amplify_domain_name

  # App Environment Variables
  next_public_app_env          = var.next_public_app_env
  next_public_graphql_endpoint = var.next_public_graphql_endpoint
}
