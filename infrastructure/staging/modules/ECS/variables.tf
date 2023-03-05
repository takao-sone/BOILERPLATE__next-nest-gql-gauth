# Base ========================
variable "project_name" {
  type = string
}

variable "project_stg" {
  type = string
}

variable "aws_region" {
  type = string
}

# ECS Task ===========================
variable "prisma_container_cpu" {
  type = number
}

variable "prisma_container_memory" {
  type = number
}

# RDS ===========================
variable "app_rds_writer_instance_endpoint" {
  type = string
}

variable "app_rds_database_name" {
  type = string
}

variable "app_rds_master_username" {
  type = string
}

variable "app_rds_master_password" {
  type = string
}

# locals ===========================
locals {
  resource_prefix = "${var.project_name}-${var.project_stg}"
}

locals {
  database_url = "mysql://${var.app_rds_master_username}:${var.app_rds_master_password}@${var.app_rds_writer_instance_endpoint}/${var.app_rds_database_name}"
}
