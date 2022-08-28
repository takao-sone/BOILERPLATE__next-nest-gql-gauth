resource "aws_apprunner_service" "app" {
  service_name = "${local.resource_prefix}-apprunner-service"

  health_check_configuration {
    healthy_threshold   = 1
    interval            = 10
    path                = "/"
    protocol            = "TCP"
    timeout             = 5
    unhealthy_threshold = 5
  }

  instance_configuration {
    cpu               = "1024"
    memory            = "2048"
    instance_role_arn = aws_iam_role.apprunner_instance.arn
  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.apprunner.arn
    }
  }

  observability_configuration {
    observability_configuration_arn = aws_apprunner_observability_configuration.app.arn
    observability_enabled           = var.ar_observability_enabled
  }

  source_configuration {
    auto_deployments_enabled = true

    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_ecr_access.arn
    }

    image_repository {
      image_identifier      = "${var.ecr_repository_url_apprunner}:latest"
      image_repository_type = "ECR"

      image_configuration {
        port = var.ar_app_port
        runtime_environment_variables = {
          "NODE_ENV"                 = var.ar_node_env
          "APP_ENV"                  = var.ar_app_env
          "ACCESS_TOKEN_EXPIRES_IN"  = var.ar_access_token_expires_in
          "ACCESS_TOKEN_SECRET"      = var.ar_access_token_secret
          "APP_HOST"                 = var.ar_app_host
          "APP_PORT"                 = var.ar_app_port
          "DATABASE_URL"             = var.ar_database_url
          "JWT_AUDIENCE_WEB"         = var.ar_jwt_audience_web
          "JWT_HASH_ALGORITHM"       = var.ar_jwt_hash_algorithm
          "JWT_ISSUER"               = var.ar_jwt_issuer
          "REDIS_HOST"               = var.ar_redis_host
          "REDIS_PORT"               = var.ar_redis_port
          "REFRESH_TOKEN_EXPIRES_IN" = var.ar_refresh_token_expires_in
          "REFRESH_TOKEN_SECRET"     = var.ar_refresh_token_secret
          "SESSION_MAX_AGE"          = var.ar_session_max_age
          "SESSION_NAME"             = var.ar_session_name
          "SESSION_SECRET"           = var.ar_session_secret
        }
      }
    }
  }

  tags = {
    "Name" = "${local.resource_prefix}-apprunner-service"
  }
}

resource "aws_apprunner_observability_configuration" "app" {
  observability_configuration_name = "${local.resource_prefix}-obs-config"

  trace_configuration {
    vendor = "AWSXRAY"
  }

  tags = {
    Name = "${local.resource_prefix}-obs-config"
  }
}

resource "aws_apprunner_vpc_connector" "apprunner" {
  vpc_connector_name = "${local.resource_prefix}-rds-vpc-connector"
  security_groups    = var.ar_vpc_connector_sg_ids
  subnets            = var.ar_vpc_connector_target_subnet_ids

  tags = {
    "Name" = "${local.resource_prefix}-rds-vpc-connector"
  }
}

resource "aws_iam_role" "apprunner_ecr_access" {
  name               = "${local.resource_prefix}-apprunner-ecr-access"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.apprunner_ecr_access.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
  ]

  tags = {
    "Name" = "${local.resource_prefix}-apprunner-ecr-access"
  }
}

data "aws_iam_policy_document" "apprunner_ecr_access" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type = "Service"
      identifiers = [
        "build.apprunner.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "apprunner_instance" {
  name               = "${local.resource_prefix}-apprunner-instance"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.apprunner_instance.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
  ]

  tags = {
    "Name" = "${local.resource_prefix}-apprunner-instance"
  }
}

data "aws_iam_policy_document" "apprunner_instance" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type = "Service"
      identifiers = [
        "tasks.apprunner.amazonaws.com"
      ]
    }
  }
}
