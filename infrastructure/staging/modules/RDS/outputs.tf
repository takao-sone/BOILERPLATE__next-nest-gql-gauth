output "rds_writer_instance_endpoint" {
  value = aws_rds_cluster.rds_cluster.endpoint
}

output "rds_database_name" {
  value = aws_rds_cluster.rds_cluster.database_name
}

output "rds_master_username" {
  value = aws_rds_cluster.rds_cluster.master_username
}

output "rds_master_password" {
  value = aws_rds_cluster.rds_cluster.master_password
}
