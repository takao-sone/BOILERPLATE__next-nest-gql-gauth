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

# MEMO:
# デフォルトではVPCはインターネットアクセスを許可してない
# NAT等を有効にしたい場合はモジュール内のコメントアウトしたリソースをコメントインすること
module "networking" {
  source                      = "./modules/Networking"
  project_name                = var.project_name
  project_stg                 = var.project_stg
  vpc_cidr                    = var.vpc_cidr
  public_subnet_general_cidrs = var.public_subnet_general_cidrs
  private_subnet_rds_cidrs    = var.private_subnet_rds_cidrs
  count_of_public_nats        = var.count_of_public_nats
}

module "ecs" {
  source       = "./modules/ECS"
  project_name = var.project_name
  project_stg  = var.project_stg
}

module "rds" {
  source                              = "./modules/RDS"
  project_name                        = var.project_name
  project_stg                         = var.project_stg
  rds_subnet_group_subnet_ids         = module.networking.rds_subnet_group_subnet_ids
  rds_security_group_ids              = module.networking.rds_security_group_ids
  rds_vpc_connector_sg_id             = module.networking.rds_vpc_connector_sg_id
  rds_cluster_parameter_group_name    = var.rds_cluster_parameter_group_name
  rds_enabled_cloudwatch_logs_exports = var.rds_enabled_cloudwatch_logs_exports
  rds_master_username                 = var.rds_master_username
  rds_master_password                 = var.rds_master_password
}

module "apprunner" {
  source                             = "./modules/AppRunner"
  project_name                       = var.project_name
  project_stg                        = var.project_stg
  ar_domain_name                     = var.ar_domain_name
  ar_vpc_connector_sg_ids            = [module.networking.app_runner_vpc_connector_sg_id]
  ar_vpc_connector_target_subnet_ids = module.networking.app_runner_vpc_connector_target_subnet_ids
  ar_observability_enabled           = var.ar_observability_enabled
  # AppRunner App Env Variables ===========================
  ecr_repository_url_apprunner = module.ecs.ecr_repository_url_apprunner
  ar_node_env                  = var.ar_node_env
  ar_app_env                   = var.ar_app_env
  ar_access_token_expires_in   = var.ar_access_token_expires_in
  ar_access_token_secret       = var.ar_access_token_secret
  ar_app_host                  = var.ar_app_host
  ar_app_port                  = var.ar_app_port
  ar_app_frontend_origin       = var.ar_app_frontend_origin
  ar_database_url              = var.ar_database_url
  ar_jwt_audience_web          = var.ar_jwt_audience_web
  ar_jwt_hash_algorithm        = var.ar_jwt_hash_algorithm
  ar_jwt_issuer                = var.ar_jwt_issuer
  ar_redis_host                = var.ar_redis_host
  ar_redis_port                = var.ar_redis_port
  ar_refresh_token_expires_in  = var.ar_refresh_token_expires_in
  ar_refresh_token_secret      = var.ar_refresh_token_secret
  ar_session_max_age           = var.ar_session_max_age
  ar_session_name              = var.ar_session_name
  ar_session_secret            = var.ar_session_secret
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
