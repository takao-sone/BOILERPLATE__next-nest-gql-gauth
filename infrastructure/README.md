## My AWS Basic ECS Architecture with Terraform

### SETUP

#### Terraform

```shell
cd infrastructure/{environment}
touch terraform.tfvars
terraform init
terraform get
terraform plan
terraform apply
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
