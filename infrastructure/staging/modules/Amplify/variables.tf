# Base ========================
variable "project_name" {
  type = string
}

variable "project_stg" {
  type = string
}

# Github ===========================
variable "github_account_name" {
  type = string
}

variable "github_repository_name_amplify" {
  type = string
}

variable "github_access_token_amplify" {
  type = string
}

variable "amplify_github_branch_name_dev" {
  type = string
}

# Amplify ===========================
variable "amplify_domain_name" {
  type = string
}

variable "amplify_staging_basic_auth_username" {
  type = string
}

variable "amplify_staging_basic_auth_password" {
  type = string
}

# App ===========================
variable "next_public_app_env" {
  type = string
}

variable "next_public_graphql_endpoint" {
  type = string
}

# locals ===========================
locals {
  resource_prefix = "${var.project_name}-${var.project_stg}"
}
