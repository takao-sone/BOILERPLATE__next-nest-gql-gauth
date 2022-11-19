output "vpc_id" {
  value = aws_vpc.vpc.id
}

# AppRunner ===========================
output "app_runner_vpc_connector_sg_id" {
  value = aws_security_group.app_runner_vpc_connector_sg.id
}

# RDS ===========================
output "rds_vpc_connector_sg_id" {
  value = aws_security_group.rds_sg.id
}

output "rds_security_group_ids" {
  value = [aws_security_group.rds_sg.id]
}

output "rds_subnet_ids" {
  value = aws_subnet.private_subnets_rds[*].id
}

# ElasticCache ===========================
output "elasticcache_subnet_ids" {
  value = aws_subnet.private_subnets_elasticcache[*].id
}

output "elasticcache_security_group_ids" {
  value = [aws_security_group.elasticcache_sg.id]
}
