resource "aws_iam_openid_connect_provider" "github_actions" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = data.tls_certificate.github_actions.certificates[*].sha1_fingerprint

  tags = {
    "Name" = "${local.resource_prefix}-github-actions-oidc-provider"
  }
}

// GithubActionsのbuild.yml内で利用するrole
resource "aws_iam_role" "github_actions_push_image" {
  name               = "${local.resource_prefix}-gha-push-image-role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json

  tags = {
    "Name" = "${local.resource_prefix}-gha-push-image-role"
  }
}

resource "aws_iam_role_policy" "github_actions_push_image" {
  name   = "${local.resource_prefix}-gha-push-image-role-policy"
  role   = aws_iam_role.github_actions_push_image.id
  policy = data.aws_iam_policy_document.github_actions_push_image.json
}

data "http" "github_actions_openid_configuration" {
  url = "https://token.actions.githubusercontent.com/.well-known/openid-configuration"
}

data "tls_certificate" "github_actions" {
  url = jsondecode(data.http.github_actions_openid_configuration.response_body).jwks_uri
}

data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    actions = [
      "sts:AssumeRoleWithWebIdentity"
    ]
    principals {
      type        = "Federated"
      identifiers = [
        aws_iam_openid_connect_provider.github_actions.arn
      ]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [
        "repo:${var.github_account_name}/${var.github_repository_name}:*"
        // TODO: 特定のリポジトリの特定のブランチからのみ認証を許可したい場合
        // "token.actions.githubusercontent.com:sub": "repo:<GitHubユーザー名>/<GitHubリポジトリ名>:ref:refs/heads/<ブランチ名>"
      ]
    }
  }
}

data "aws_iam_policy_document" "github_actions_push_image" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken"
    ]
    resources = [
      "*"
    ]
  }
  statement {
    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart",
      "ecr:ListImages",
      "ecr:CompleteLayerUpload",
      "ecr:BatchCheckLayerAvailability"
    ]
    resources = [
      var.ecr_repository_backend_arn
    ]
  }
}
