resource "aws_ecr_repository" "backend" {
  name                 = "${local.resource_prefix}-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    "Name" = "${local.resource_prefix}-backend"
  }
}
