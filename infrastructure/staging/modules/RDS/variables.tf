# Base ========================
variable "project_name" {
  type = string
}

variable "project_stg" {
  type = string
}

# RDS ===========================
variable "rds_security_group_ids" {
  type = list(string)
}

variable "rds_subnet_group_subnet_ids" {
  type = list(string)
}

variable "rds_vpc_connector_sg_id" {
  type = string
}

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

# locals ===========================
locals {
  resource_prefix = "${var.project_name}-${var.project_stg}"
}
