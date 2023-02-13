output "ecr_repository_url_apprunner" {
  value = aws_ecr_repository.backend.repository_url
}

output "ecr_repository_arn_backend" {
  value = aws_ecr_repository.backend.arn
}
