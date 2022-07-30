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

variable "github_repository_name_amplify" {
  type = string
}

variable "github_access_token_amplify" {
  type = string
}

# Amplify ===========================
variable "amplify_domain_name" {
  type = string
}

# Networking ===========================
# variable "vpc_cidr" {
#   type = string
# }

# variable "public_subnet_cidrs" {
#   type = list(string)
# }

# variable "private_subnet_container_cidrs" {
#   type = list(string)
# }

# variable "private_subnet_db_cidrs" {
#   type = list(string)
# }

# variable "private_subnet_redis_cidrs" {
#   type = list(string)
# }

# variable "private_subnet_endpoint_cidrs" {
#   type = list(string)
# }

# DB ===========================
# variable "rds_master_username" {
#   type = string
# }

# variable "rds_master_password" {
#   type = string
# }

# Deploy
# variable "github_account_name" {
#   type = string
# }

# variable "github_repository_name" {
#   type = string
# }
