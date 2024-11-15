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
      image_identifier      = "${var.ecr_repository_url_apprunner}:app"
      image_repository_type = "ECR"

      image_configuration {
        port                          = var.ar_app_port
        runtime_environment_variables = {
          "NODE_ENV" = var.ar_node_env
          "APP_ENV"  = var.ar_app_env

          "APP_HOST"            = var.ar_app_host
          "APP_PORT"            = var.ar_app_port
          "APP_FRONTEND_ORIGIN" = var.ar_app_frontend_origin

          "ACCESS_TOKEN_SECRET"      = var.ar_access_token_secret
          "REFRESH_TOKEN_SECRET"     = var.ar_refresh_token_secret
          "JWT_ISSUER"               = var.ar_jwt_issuer
          "JWT_AUDIENCE_WEB"         = var.ar_jwt_audience_web
          "JWT_HASH_ALGORITHM"       = var.ar_jwt_hash_algorithm
          "ACCESS_TOKEN_EXPIRES_IN"  = var.ar_access_token_expires_in
          "REFRESH_TOKEN_EXPIRES_IN" = var.ar_refresh_token_expires_in

          "DATABASE_URL" = local.database_url

          "REDIS_HOST"                    = var.ar_redis_host
          "REDIS_PORT"                    = var.ar_redis_port
          "REDIS_SESSION_KEY_PREFIX"      = var.ar_redis_session_key_prefix
          "REDIS_EXISTING_SESSION_PREFIX" = var.ar_redis_existing_session_prefix

          "SESSION_SECRET"             = var.ar_session_secret
          "SESSION_NAME"               = var.ar_session_name
          "SESSION_MAX_AGE"            = var.ar_session_max_age
          "SESSION_MAX_AGE_IN_SECONDS" = var.ar_session_max_age_in_seconds
        }
      }
    }
  }

  depends_on = [
    time_sleep.aws_iam_roles
  ]

  tags = {
    "Name" = "${local.resource_prefix}-apprunner-service"
  }
}

resource "time_sleep" "aws_iam_roles" {
  depends_on = [
    aws_iam_role.apprunner_ecr_access,
    aws_iam_role.apprunner_instance
  ]

  create_duration = "20s"
}

resource "aws_apprunner_custom_domain_association" "api" {
  service_arn          = aws_apprunner_service.app.arn
  domain_name          = "api.${data.aws_route53_zone.apprunner_domain.name}"
  enable_www_subdomain = false
}

resource "aws_route53_record" "api" {
  count = var.STEP_3 ? 1 : 0

  zone_id = data.aws_route53_zone.apprunner_domain.zone_id
  name    = aws_apprunner_custom_domain_association.api.domain_name
  type    = "CNAME"
  ttl     = 5
  records = [aws_apprunner_custom_domain_association.api.dns_target]
}

resource "aws_route53_record" "certificate_validations" {
  for_each = var.STEP_3 ? {
    for record in aws_apprunner_custom_domain_association.api.certificate_validation_records : record.name => {
      name   = record.name
      record = record.value
    }
  } : {}

  zone_id = data.aws_route53_zone.apprunner_domain.zone_id
  name    = each.value.name
  type    = "CNAME"
  ttl     = 5
  records = [each.value.record]
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
  vpc_connector_name = "${local.resource_prefix}-vpc-connector"
  security_groups    = var.ar_vpc_connector_sg_ids
  subnets            = var.ar_vpc_connector_target_subnet_ids

  tags = {
    "Name" = "${local.resource_prefix}-vpc-connector"
  }
}

resource "aws_iam_role" "apprunner_ecr_access" {
  name                = "${local.resource_prefix}-apprunner-ecr-access"
  path                = "/"
  assume_role_policy  = data.aws_iam_policy_document.apprunner_ecr_access.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
  ]

  tags = {
    "Name" = "${local.resource_prefix}-apprunner-ecr-access"
  }
}

resource "aws_iam_role" "apprunner_instance" {
  name                = "${local.resource_prefix}-apprunner-instance"
  path                = "/"
  assume_role_policy  = data.aws_iam_policy_document.apprunner_instance.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
  ]

  tags = {
    "Name" = "${local.resource_prefix}-apprunner-instance"
  }
}

data "aws_iam_policy_document" "apprunner_ecr_access" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type        = "Service"
      identifiers = [
        "build.apprunner.amazonaws.com"
      ]
    }
  }
}

data "aws_iam_policy_document" "apprunner_instance" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type        = "Service"
      identifiers = [
        "tasks.apprunner.amazonaws.com"
      ]
    }
  }
}

data "aws_route53_zone" "apprunner_domain" {
  name = var.ar_domain_name
}
