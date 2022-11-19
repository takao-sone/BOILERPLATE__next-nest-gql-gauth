# Base ========================
variable "project_name" {
  type = string
}

variable "project_stg" {
  type = string
}

# ===========================
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

# locals ===========================
locals {
  resource_prefix = "${var.project_name}-${var.project_stg}"
}
