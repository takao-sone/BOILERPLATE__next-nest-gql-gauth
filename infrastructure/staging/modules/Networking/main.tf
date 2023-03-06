# Data ===============================
data "aws_region" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

# VPC ===============================
resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_cidr
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = {
    Name = "${local.resource_prefix}-vpc"
  }
}

# Subnet ===============================
resource "aws_subnet" "public_subnets" {
  count             = 2
  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = var.public_subnet_cidrs[count.index]
  tags              = {
    Name = "${local.resource_prefix}-public-subnet-${count.index}"
  }
}

resource "aws_subnet" "private_subnets" {
  count             = 2
  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = var.private_subnet_cidrs[count.index]
  tags              = {
    Name = "${local.resource_prefix}-private-subnet-${count.index}"
  }
}

# Route Table ===============================
resource "aws_route_table" "igw_rt" {
  vpc_id = aws_vpc.vpc.id
  route {
    gateway_id = aws_internet_gateway.igw.id
    cidr_block = "0.0.0.0/0"
  }
  tags = {
    Name = "${local.resource_prefix}-igw-route"
  }
}

resource "aws_route_table_association" "igw_rt_association" {
  count          = length(aws_subnet.public_subnets)
  route_table_id = aws_route_table.igw_rt.id
  subnet_id      = aws_subnet.public_subnets[count.index].id
}

resource "aws_route_table" "private_rts" {
  count  = length(aws_subnet.private_subnets)
  vpc_id = aws_vpc.vpc.id
  route {
    nat_gateway_id = aws_nat_gateway.public_nats[0].id
    cidr_block     = "0.0.0.0/0"
  }
  tags = {
    Name = "${local.resource_prefix}-private-route-${count.index}"
  }
}

resource "aws_route_table_association" "nat_rt_association" {
  count          = length(aws_subnet.private_subnets)
  route_table_id = aws_route_table.private_rts[count.index].id
  subnet_id      = aws_subnet.private_subnets[count.index].id
}

# Internet Gateway ===============================
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags   = {
    Name = "${local.resource_prefix}-igw"
  }
}

# NAT Gateway ===============================
resource "aws_nat_gateway" "public_nats" {
  count             = var.count_of_public_nats
  connectivity_type = "public"
  allocation_id     = aws_eip.eip_public_nats[count.index].id
  subnet_id         = aws_subnet.public_subnets[count.index].id
  tags              = {
    Name = "${local.resource_prefix}-public-nat-${count.index}"
  }
  depends_on = [aws_internet_gateway.igw]
}

# VPC Endpoint ===============================
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.vpc.id
  service_name      = "com.amazonaws.${data.aws_region.current.name}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = aws_route_table.private_rts[*].id
  tags              = {
    Name = "${local.resource_prefix}-s3-vpc-endpoint"
  }
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id              = aws_vpc.vpc.id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = aws_subnet.private_subnets[*].id
  security_group_ids  = [
    aws_security_group.vpc_endpoint_prisma.id
  ]
  tags = {
    Name = "${local.resource_prefix}-ecr-dkr-vpc-endpoint"
  }
}

resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = aws_vpc.vpc.id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.ecr.api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = aws_subnet.private_subnets[*].id
  security_group_ids  = [
    aws_security_group.vpc_endpoint_prisma.id
  ]
  tags = {
    Name = "${local.resource_prefix}-ecr-api-vpc-endpoint"
  }
}

resource "aws_vpc_endpoint" "ecs_task_prisma_logs" {
  vpc_id              = aws_vpc.vpc.id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.logs"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = aws_subnet.private_subnets[*].id
  security_group_ids  = [
    aws_security_group.vpc_endpoint_prisma.id
  ]
  tags = {
    Name = "${local.resource_prefix}-logs-vpc-endpoint"
  }
}

# Elastic IP ===============================
resource "aws_eip" "eip_public_nats" {
  count = var.count_of_public_nats
  vpc   = true
  tags  = {
    Name = "${local.resource_prefix}-eip-public-nat-${count.index}"
  }
  depends_on = [aws_internet_gateway.igw]
}

# Security Group ==============================================
resource "aws_security_group" "app_runner_vpc_connector_sg" {
  vpc_id = aws_vpc.vpc.id
  name   = "${local.resource_prefix}-apprunner-vpc-connector-sg"
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "${local.resource_prefix}-apprunner-vpc-connector-sg"
  }
}

resource "aws_security_group" "rds_sg" {
  vpc_id = aws_vpc.vpc.id
  name   = "${local.resource_prefix}-rds-sg"
  ingress {
    protocol        = "tcp"
    from_port       = 3306
    to_port         = 3306
    security_groups = [
      aws_security_group.app_runner_vpc_connector_sg.id,
      aws_security_group.ecs_task_prisma.id
    ]
  }
  tags = {
    Name = "${local.resource_prefix}-rds-sg"
  }
}

resource "aws_security_group" "redis_sg" {
  vpc_id = aws_vpc.vpc.id
  name   = "${local.resource_prefix}-redis-sg"
  ingress {
    protocol        = "tcp"
    from_port       = 6379
    to_port         = 6379
    security_groups = [aws_security_group.app_runner_vpc_connector_sg.id]
  }
  tags = {
    Name = "${local.resource_prefix}-redis-sg"
  }
}

resource "aws_security_group" "vpc_endpoint_prisma" {
  name   = "${local.resource_prefix}-ecs-task-prisma-vpc-endpoint-sg"
  vpc_id = aws_vpc.vpc.id
  ingress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    security_groups = [aws_security_group.ecs_task_prisma.id]
  }
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "${local.resource_prefix}-ecs-task-prisma-vpc-endpoint-sg"
  }
}

resource "aws_security_group" "ecs_task_prisma" {
  name   = "${local.resource_prefix}-ecs-task-prisma-sg"
  vpc_id = aws_vpc.vpc.id
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "${local.resource_prefix}-ecs-task-prisma-sg"
  }
}
