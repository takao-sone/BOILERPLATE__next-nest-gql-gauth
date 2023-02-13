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

variable "github_repository_name" {
  type = string
}

# ECR ===========================
variable "ecr_repository_backend_arn" {
  type = string
}

locals {
  resource_prefix = "${var.project_name}-${var.project_stg}"
}
