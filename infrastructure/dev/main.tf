provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region

  default_tags {
    tags = {
      Created_by = "Terraform"
      Project    = var.project_name
      Stage      = var.project_stg
    }
  }
}

data "aws_caller_identity" "current" {}

# resource "aws_resourcegroups_group" "resource_group" {
#   name = "${var.project_name}-resource-group"

#   resource_query {
#     query = jsonencode(
#       {
#         ResourceTypeFilters = [
#           "AWS::AllSupported",
#         ]
#         TagFilters = [
#           {
#             Key = "Project"
#             Values = [
#               var.project_name,
#             ]
#           },
#         ]
#       }
#     )
#     type = "TAG_FILTERS_1_0"
#   }

#   tags = {
#     Name = "${var.project_name}-${var.project_stg}-resource-group"
#   }
# }

module "amplify" {
  source                         = "./modules/Amplify"
  project_name                   = var.project_name
  project_stg                    = var.project_stg
  github_account_name            = var.github_account_name
  github_repository_name_amplify = var.github_repository_name_amplify
  github_access_token_amplify    = var.github_access_token_amplify
}
