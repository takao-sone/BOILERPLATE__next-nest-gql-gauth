output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "app_runner_vpc_connector_sg_id" {
  value = aws_security_group.app_runner_vpc_connector_sg.id
}

output "rds_vpc_connector_sg_id" {
  value = aws_security_group.rds_sg.id
}

output "rds_security_group_ids" {
  value = [aws_security_group.rds_sg.id]
}

output "rds_subnet_group_subnet_ids" {
  value = aws_subnet.private_subnets_rds[*].id
}
