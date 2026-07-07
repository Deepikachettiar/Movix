#the extracted data like the cluster end points and subnet ids will be extracted from this

output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The ID of our custom VPC mesh"
}

output "public_subnet_ids" {
  value       = aws_subnet.public[*].id
  description = "List of IDs for our public network lanes"
}

output "private_subnet_ids" {
  value       = aws_subnet.private[*].id
  description = "List of IDs for our secure private network lanes"
}