# Base ========================
variable "project_name" {
  type = string
}

variable "project_stg" {
  type = string
}

# Github ===========================

# AppRunner ===========================
variable "ecr_repository_url_apprunner" {
  type = string
}

variable "ar_vpc_connector_sg_ids" {
  type = list(string)
}

variable "ar_vpc_connector_target_subnet_ids" {
  type = list(string)
}

variable "ar_observability_enabled" {
  type = bool
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

variable "ar_database_url" {
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

variable "ar_redis_host" {
  type = string
}

variable "ar_redis_port" {
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

# locals ===========================
locals {
  resource_prefix = "${var.project_name}-${var.project_stg}"
}
