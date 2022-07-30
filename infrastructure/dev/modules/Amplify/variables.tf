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

variable "develop_branch_name" {
  type    = string
  default = "develop"
}

# App ===========================
variable "next_public_app_env" {
  type    = string
  default = "development"
}

variable "next_public_graphql_endpoint" {
  type    = string
  default = ""
}
