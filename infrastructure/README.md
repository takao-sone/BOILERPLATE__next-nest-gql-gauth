## My AWS Basic ECS Architecture with Terraform

### SETUP

#### Terraform

```shell
cd infrastructure/{environment}
touch terraform.tfvars # tfvarsの各項目入力
terraform init
terraform get
terraform plan
terraform apply
```

**Amplify**
1. AWSコンソールのAmplifyへアクセス
2. 作成したappにアクセス
3. `Run Build` をクリックしてデプロイ

### Import

```shell
# import a resource into module
terraform import module.rds.aws_rds_cluster.rds_cluster boilerplate-staging-rds-cluster
# show tfstate
terraform state show module.rds.aws_rds_cluster.rds_cluster
# delete {Error: Value for unconfigurable attribute} values
terraform plan -target=module.rds.aws_rds_cluster.rds_cluster
# validation
terraform validate
# check plan
terraform plan -target=module.rds.aws_rds_cluster.rds_cluster
```

### Main Resources

#### Other
1. Resource Groups

#### Amplify
1. Amplify Hosting (develop branch)

#### Networking
1. VPC
<!-- 2. Internet Gateway
3. 4 VPC endpoints  
   (ecr_api, ecr_dkr, s3, ecs_awslogs)
4. 4 Subnets  
   (public, private_container, private_db, private_endpoint)
5. 2 Route Tables
   (for public subnets, for private containers)
6. Security Group
   (for vpc_endpoints) -->
