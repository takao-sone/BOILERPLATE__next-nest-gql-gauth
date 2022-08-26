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

# TODO
# resource "aws_iam_role" "apprunner_instance" {
#   name               = "${local.resource_prefix}-apprunner-instance"
#   path               = "/"
#   assume_role_policy = data.aws_iam_policy_document.apprunner_instance.json
#   managed_policy_arns = [
#     # "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
#   ]

#   tags = {
#     "Name" = "${local.resource_prefix}-apprunner-instance"
#   }
# }

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

# TODO
# data "aws_iam_policy_document" "apprunner_instance" {
#   statement {
#     actions = [
#       "sts:AssumeRole"
#     ]

#     principals {
#       type = "Service"
#       identifiers = [
#         "tasks.apprunner.amazonaws.com"
#       ]
#     }
#   }
# }
