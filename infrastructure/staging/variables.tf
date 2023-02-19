# SetUp ===========================
variable "STEP_2" {
  type = bool
}

variable "STEP_3" {
  type = bool
}

# Base ========================
variable "project_name" {
  type = string

  validation {
    # regex(...) fails if it cannot find a match
    condition     = can(regex("^[a-z0-9_-]*$", var.project_name))
    error_message = "For the project_name value only a-z, 0-9, _ and - are allowed."
  }
}

variable "project_stg" {
  type = string
}

variable "aws_profile" {
  type = string
}

variable "aws_region" {
  type = string
}

# Github ===========================
variable "github_account_name" {
  type = string
}

variable "github_repository_name" {
  type = string
}

variable "github_repository_name_amplify" {
  type = string
}

variable "github_access_token_amplify" {
  type = string
}

# Networking ===========================
variable "vpc_cidr" {
  type = string
}

variable "public_subnet_cidrs" {
  type = list(string)
}

variable "private_subnet_cidrs" {
  type = list(string)
}

variable "count_of_public_nats" {
  type = number
}

# Amplify ===========================
variable "amplify_domain_name" {
  type = string
}

variable "amplify_github_branch_name_dev" {
  type = string
}

variable "next_public_app_env" {
  type = string
}

variable "next_public_graphql_endpoint" {
  type = string
}

variable "amplify_staging_basic_auth_username" {
  type = string
}

variable "amplify_staging_basic_auth_password" {
  type = string
}

# AppRunner ===========================
variable "ar_observability_enabled" {
  type = bool
}

variable "ar_domain_name" {
  type = string
}

# AppRunner App Env Variables ===========================
variable "ar_access_token_expires_in" {
  type = string
}

variable "ar_access_token_secret" {
  type = string
}

variable "ar_app_env" {
  type = string
}

variable "ar_app_host" {
  type = string
}

variable "ar_app_port" {
  type = string
}

variable "ar_app_frontend_origin" {
  type = string
}

variable "ar_jwt_audience_web" {
  type = string
}

variable "ar_jwt_hash_algorithm" {
  type = string
}

variable "ar_jwt_issuer" {
  type = string
}

variable "ar_node_env" {
  type = string
}

variable "ar_refresh_token_expires_in" {
  type = string
}

variable "ar_refresh_token_secret" {
  type = string
}

variable "ar_session_max_age" {
  type = string
}

variable "ar_session_name" {
  type = string
}

variable "ar_session_secret" {
  type = string
}

variable "ar_redis_session_key_prefix" {
  type = string
}

variable "ar_redis_existing_session_prefix" {
  type = string
}

# RDS ===========================
variable "rds_cluster_parameter_group_name" {
  type = string
}

variable "rds_enabled_cloudwatch_logs_exports" {
  type = list(string)
}

variable "rds_master_username" {
  type = string
}

variable "rds_master_password" {
  type = string
}

