# RDS Cluster ==============================================
resource "aws_rds_cluster" "rds_cluster" {
  cluster_identifier              = "${local.resource_prefix}-rds-cluster"
  db_cluster_parameter_group_name = var.rds_cluster_parameter_group_name
  enabled_cloudwatch_logs_exports = var.rds_enabled_cloudwatch_logs_exports
  db_subnet_group_name            = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids          = var.rds_security_group_ids
  database_name                   = replace(var.project_name, "-", "_")
  master_username                 = var.rds_master_username
  master_password                 = var.rds_master_password

  engine                       = "aurora-mysql"
  engine_version               = "8.0.mysql_aurora.3.02.2"
  engine_mode                  = "provisioned"
  port                         = 3306
  preferred_backup_window      = "17:00-17:30"
  preferred_maintenance_window = "sun:18:00-sun:18:30"
  backtrack_window             = 0
  backup_retention_period      = 1

  copy_tags_to_snapshot               = true
  deletion_protection                 = false
  enable_http_endpoint                = false
  iam_database_authentication_enabled = false
  iam_roles                           = []
  skip_final_snapshot                 = true
  storage_encrypted                   = true

  serverlessv2_scaling_configuration {
    max_capacity = 1
    min_capacity = 0.5
  }

  tags = {
    Name = "${local.resource_prefix}-rds-cluster"
  }
}

# RDS Cluster Instance ==============================================
resource "aws_rds_cluster_instance" "rds_cluster_instance_1" {
  apply_immediately = true

  identifier         = "${local.resource_prefix}-rds-cluster-instance-1"
  cluster_identifier = aws_rds_cluster.rds_cluster.id
  engine             = aws_rds_cluster.rds_cluster.engine
  engine_version     = aws_rds_cluster.rds_cluster.engine_version

  instance_class               = "db.serverless"
  auto_minor_version_upgrade   = true
  copy_tags_to_snapshot        = false
  monitoring_role_arn          = aws_iam_role.rds_monitoring_role.arn
  monitoring_interval          = 60
  performance_insights_enabled = false
  promotion_tier               = 1
  publicly_accessible          = false

  tags = {
    Name = "${local.resource_prefix}-rds-cluster-instance-1"
  }
}

# Subnet Group ==============================================
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${local.resource_prefix}-rds-subnet-group"
  subnet_ids = var.rds_subnet_group_subnet_ids

  tags = {
    Name = "${local.resource_prefix}-rds-subnet-group"
  }
}

# IAM ==============================================
resource "aws_iam_role" "rds_monitoring_role" {
  name                = "${local.resource_prefix}-rds-enhanced-monitoring"
  assume_role_policy  = data.aws_iam_policy_document.rds_monitoring_role.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
  ]
  tags = {
    Name = "${local.resource_prefix}-rds-enhanced-monitoring"
  }
}

data "aws_iam_policy_document" "rds_monitoring_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["monitoring.rds.amazonaws.com"]
    }
  }
}
