resource "aws_elasticache_cluster" "redis" {
  cluster_id               = "${local.resource_prefix}-redis-cluster"
  az_mode                  = "single-az"
  engine                   = "redis"
  engine_version           = "7.0"
  node_type                = "cache.t2.micro"
  num_cache_nodes          = 1
  parameter_group_name     = "default.redis7"
  port                     = 6379
  security_group_ids       = var.redis_security_group_ids
  snapshot_retention_limit = 0
  subnet_group_name        = aws_elasticache_subnet_group.redis.name

  tags = {
    Name = "${local.resource_prefix}-redis-cluster"
  }
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${local.resource_prefix}-redis-subnet-group"
  subnet_ids = var.redis_subnet_group_subnet_ids

  tags = {
    "Name" = "${local.resource_prefix}-redis-subnet-group"
  }
}

# MEMO: For production setting

# resource "aws_elasticache_replication_group" "redis" {
#   replication_group_id = "${local.prefix}-redis-rg"
#   description          = "${local.prefix}-redis-rg"
#   subnet_group_name    = aws_elasticache_subnet_group.redis.id
#   security_group_ids   = var.redis_sg_ids

#   port                       = var.port
#   node_type                  = var.node_type
#   num_cache_clusters         = var.cache_cluster_number
#   engine                     = "redis"
#   engine_version             = var.engine_version
#   parameter_group_name       = var.parameter_group_name
#   automatic_failover_enabled = var.cache_cluster_number > 1
#   multi_az_enabled           = var.cache_cluster_number > 1
#   final_snapshot_identifier  = var.skip_final_snapshot ? null : "${local.prefix}-redis-snapshot"

#   tags = {
#     "Name" = "${local.prefix}-redis-rg"
#   }
# }

