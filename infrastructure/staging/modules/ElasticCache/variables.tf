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

# variable "engine_version" {
#   type = string
# }

# variable "parameter_group_name" {
#   type = string
# }

# variable "node_type" {
#   type = string
# }

# variable "cache_cluster_number" {
#   type = number
# }

# variable "port" {
#   type = number
# }

# variable "skip_final_snapshot" {
#   type = bool
# }

# variable "redis_sg_ids" {
#   type = list(string)
# }

# variable "redis_private_subnet_ids" {
#   type = list(string)
# }
