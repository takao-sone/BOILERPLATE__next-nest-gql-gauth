resource "aws_ecr_repository" "apprunner" {
  name                 = "${local.resource_prefix}-apprunner"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    "Name" = "${local.resource_prefix}-apprunner"
  }
}
