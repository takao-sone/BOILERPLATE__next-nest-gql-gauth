# Base ========================
variable "project_name" {
  type = string
}

variable "project_stg" {
  type = string
}

# Redis ===========================
variable "redis_subnet_group_subnet_ids" {
  type = list(string)
}

variable "redis_security_group_ids" {
  type = list(string)
}

# locals ===========================
locals {
  resource_prefix = "${var.project_name}-${var.project_stg}"
}
