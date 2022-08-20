# Base ========================
variable "project_name" {
  type = string
}

variable "project_stg" {
  type = string
}

# locals ===========================
locals {
  resource_prefix = "${var.project_name}-${var.project_stg}"
}
