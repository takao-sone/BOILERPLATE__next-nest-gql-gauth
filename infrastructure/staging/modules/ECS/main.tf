# Data ===============================
data "aws_region" "current" {}

# ECR ===============================
resource "aws_ecr_repository" "backend" {
  name                 = "${local.resource_prefix}-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
  image_scanning_configuration {
    scan_on_push = true
  }
  tags = {
    Name = "${local.resource_prefix}-backend"
  }
}

# ECS ===============================
resource "aws_ecs_cluster" "backend" {
  name = "${local.resource_prefix}-backend-ecs-cluster"
  tags = {
    Name = "${local.resource_prefix}-backend-ecs-cluster"
  }
}

resource "aws_ecs_task_definition" "prisma_migration" {
  family                   = "${local.resource_prefix}-backend-prisma-migration"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.prisma_container_cpu
  memory                   = var.prisma_container_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn
  container_definitions    = jsonencode(
    [
      {
        name        = "${local.resource_prefix}-backend-prisma-migration"
        image       = "${aws_ecr_repository.backend.repository_url}:prisma-migration"
        environment = [
          {
            name  = "DATABASE_URL"
            value = local.database_url
          }
        ]
        logConfiguration = {
          logDriver = "awslogs"
          options   = {
            awslogs-region        = data.aws_region.current.name
            awslogs-group         = aws_cloudwatch_log_group.ecs_task_prisma.name
            awslogs-stream-prefix = "task"
          }
        }
      }
    ]
  )
  tags = {
    Name = "${local.resource_prefix}-backend-prisma-migration-ecs-task-definition"
  }
}

resource "aws_ecs_task_definition" "prisma_seed" {
  family                   = "${local.resource_prefix}-backend-prisma-seed"
  requires_compatibilities = [
    "FARGATE"
  ]
  network_mode          = "awsvpc"
  cpu                   = var.prisma_container_cpu
  memory                = var.prisma_container_memory
  execution_role_arn    = aws_iam_role.ecs_task_execution.arn
  task_role_arn         = aws_iam_role.ecs_task.arn
  container_definitions = jsonencode(
    [
      {
        name        = "${local.resource_prefix}-backend-prisma-seed"
        image       = "${aws_ecr_repository.backend.repository_url}:prisma-seed"
        environment = [
          {
            name  = "DATABASE_URL"
            value = local.database_url
          }
        ]
        logConfiguration = {
          logDriver = "awslogs"
          options   = {
            awslogs-region        = data.aws_region.current.name
            awslogs-group         = aws_cloudwatch_log_group.ecs_task_prisma.name
            awslogs-stream-prefix = "task"
          }
        }
      }
    ]
  )
  tags = {
    Name = "${local.resource_prefix}-backend-prisma-seed-ecs-task-definition"
  }
}

# IAM ===========================
resource "aws_iam_role" "ecs_task_execution" {
  name                = "${local.resource_prefix}-ecs-task-execution-role"
  path                = "/"
  assume_role_policy  = data.aws_iam_policy_document.ecs_task_execution_assume_role.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  ]
  tags = {
    Name = "${local.resource_prefix}-ecs-task-execution-role"
  }
}

resource "aws_iam_role" "ecs_task" {
  name               = "${local.resource_prefix}-ecs-task-role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags               = {
    Name = "${local.resource_prefix}-ecs-task-role"
  }
}

data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type        = "Service"
      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
    }
  }
}

data "aws_iam_policy_document" "ecs_task_execution_assume_role" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type        = "Service"
      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
    }
  }
}

# CloudWatch ===========================
resource "aws_cloudwatch_log_group" "ecs_task_prisma" {
  name = "/ecs/${var.project_name}/${var.project_stg}"
  tags = {
    Name = "${local.resource_prefix}-ecs-task-prisma-log-group"
  }
}
