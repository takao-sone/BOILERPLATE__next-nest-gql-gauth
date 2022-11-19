output "redis_primary_endpoint" {
  value = format(
    "%s:%s",
    aws_elasticache_cluster.redis.cache_nodes[0].address,
    aws_elasticache_cluster.redis.port
  )
}

output "redis_host" {
  value = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  value = aws_elasticache_cluster.redis.port
}
