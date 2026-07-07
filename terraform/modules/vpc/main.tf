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