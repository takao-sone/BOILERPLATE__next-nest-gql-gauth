output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "private_subnet_ids" {
  value = aws_subnet.private_subnets[*].id
}

# AppRunner ===========================
output "app_runner_vpc_connector_sg_id" {
  value = aws_security_group.app_runner_vpc_connector_sg.id
}

# RDS ===========================
output "rds_security_group_id" {
  value = aws_security_group.rds_sg.id
}

# ElasticCache ===========================
output "redis_security_group_id" {
  value = aws_security_group.redis_sg.id
}
