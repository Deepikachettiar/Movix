# this is the root for the vpc creation 
 
# 1. Create the Custom Isolated VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true # Crucial for Private DNS and EKS resolution
  enable_dns_support   = true

  tags = {
    Name = "vpc-${var.env_name}"
  }
}

# 2. Create the 2 Public Subnets (Iterating through our variable list)
resource "aws_subnet" "public" {
  #checkov:skip=CKV_AWS_130:Public subnet intentionally assigns public IPs
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true # Automatically grants public IPs to resources inside

  tags = {
    Name = "subnet-public-${count.index + 1}-${var.env_name}"
    # These specific tags allow the AWS Load Balancer Controller to auto-discover subnets later!
    "kubernetes.io/role/elb" = "1" 
  }
}

# 3. Create the 2 Private Subnets (For EKS Workers & Database Pods)
resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "subnet-private-${count.index + 1}-${var.env_name}"
    # Allows EKS to utilize these subnets for internal load balancers
    "kubernetes.io/role/internal-elb" = "1"
  }
}

# 4. The Internet Gateway (The public front door)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "igw-${var.env_name}"
  }
}

# 5. Elastic IP for the NAT Gateway
resource "aws_eip" "nat_eip" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]
}

# 6. The NAT Gateway (Sits in Public Subnet, routes Private Subnet traffic outbound safely)
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public[0].id # Placed into the first public subnet

  tags = {
    Name = "nat-gateway-${var.env_name}"
  }
}

# 7. Public Route Table (Points traffic straight to the Internet Gateway)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "rt-public-${var.env_name}"
  }
}

# 8. Private Route Table (Points internal traffic out through the NAT Gateway)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "rt-private-${var.env_name}"
  }
}

# 9. Connect Public Subnets to Public Routing
resource "aws_route_table_association" "public" {
  count          = length(var.public_subnet_cidrs)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# 10. Connect Private Subnets to Private Routing
resource "aws_route_table_association" "private" {
  count          = length(var.private_subnet_cidrs)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

#creating a IAM role for checking the vpc flow_logs_role
resource "aws_iam_role" "flow_logs_role" {

  name = "vpc-flow-logs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Service = "vpc-flow-logs.amazonaws.com"
      }

      Action = "sts:AssumeRole"
    }]
  })
}

#enabling the policy for the flow logs role
resource "aws_iam_role_policy" "flow_logs_policy" {

  role = aws_iam_role.flow_logs_role.id

  policy = jsonencode({

    Version = "2012-10-17"

    Statement = [{

      Effect = "Allow"

      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ]

      Resource = [
        aws_cloudwatch_log_group.vpc_flow_logs.arn,
        "${aws_cloudwatch_log_group.vpc_flow_logs.arn}:*"
      ]
    }]
  })
}

#enabling the flow logs to be displayed to the logs role
resource "aws_flow_log" "main" {

  iam_role_arn = aws_iam_role.flow_logs_role.arn

  log_destination = aws_cloudwatch_log_group.vpc_flow_logs.arn

  traffic_type = "ALL"

  vpc_id = aws_vpc.main.id
}



#for now creating a deflault security group 
resource "aws_default_security_group" "default" {

  vpc_id = aws_vpc.main.id

  ingress = []

  egress = []
}

# KMS key for encrypting VPC flow logs
resource "aws_kms_key" "flow_logs" {
  description             = "KMS key for VPC flow logs CloudWatch log group encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "EnableRootAccountFullAccess"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "AllowCloudWatchLogs"
        Effect = "Allow"
        Principal = {
          Service = "logs.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_kms_alias" "flow_logs" {
  name          = "alias/vpc-flow-logs-${var.env_name}"
  target_key_id = aws_kms_key.flow_logs.key_id
}

resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "/aws/vpc/flowlogs"
  retention_in_days = 365
  kms_key_id        = aws_kms_key.flow_logs.arn
}