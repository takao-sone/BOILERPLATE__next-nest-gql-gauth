resource "aws_resourcegroups_group" "resource_group" {
  name = "${var.project_name}-resource-group"

  resource_query {
    query = jsonencode(
      {
        ResourceTypeFilters = [
          "AWS::AllSupported",
        ]
        TagFilters = [
          {
            Key = "Project"
            Values = [
              var.project_name,
            ]
          },
          {
            Key = "Stage"
            Values = [
              var.project_stg,
            ]
          },
        ]
      }
    )
    type = "TAG_FILTERS_1_0"
  }

  tags = {
    Name = "${local.resource_prefix}-resource-group"
  }
}
