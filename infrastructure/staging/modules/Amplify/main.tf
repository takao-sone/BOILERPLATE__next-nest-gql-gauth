resource "aws_amplify_app" "frontend" {
  name     = var.github_repository_name_amplify
  platform = "WEB"

  enable_basic_auth      = true
  basic_auth_credentials = base64encode("${var.amplify_staging_basic_auth_username}:${var.amplify_staging_basic_auth_password}")

  repository   = "https://github.com/${var.github_account_name}/${var.github_repository_name_amplify}"
  access_token = var.github_access_token_amplify

  lifecycle {
    ignore_changes = [basic_auth_credentials]
  }

  tags = {
    Name = "${var.project_name}-${var.project_stg}-amplify-app"
  }
}

resource "aws_amplify_branch" "develop" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = var.amplify_github_branch_name_dev
  stage       = "DEVELOPMENT"

  enable_auto_build = true

  environment_variables = {
    NEXT_PUBLIC_APP_ENV          = var.next_public_app_env
    NEXT_PUBLIC_GRAPHQL_ENDPOINT = var.next_public_graphql_endpoint
  }

  tags = {
    Name = "${var.project_name}-${var.project_stg}-amplify-branch"
  }
}

resource "aws_amplify_domain_association" "branch_develop" {
  app_id      = aws_amplify_app.frontend.id
  domain_name = var.amplify_domain_name

  sub_domain {
    branch_name = aws_amplify_branch.develop.branch_name
    prefix      = ""
  }
}
