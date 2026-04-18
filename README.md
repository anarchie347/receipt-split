# Reciept Splitter

A simple web app to ease with splitting the costs of a reciept between people.

All deployed on AWS Cloudfront,S3 and Lambda

# Usage

- Check [dependencies](#Dependencies), ensure they are installed and credentials are setup
- run `scripts/deploy.sh`

Use `-v` or `--verbose` to show outputs of all commands being run, useful for troubleshooting

# Dependencies

- Terraform
- npm
- aws cli

Credential requirements:
- AWS credentials setup for Terraform and AWS CLI (both are required)
- [Veryfi](https://www.veryfi.com) credentials:
    - populate `deployment/terraform.tfvars` with the required variables specified in `deployment/variables.tf`
    - `veryfi_client_id = "XXXXXX"
    - `veryfi_authorization = "XXXXXXXXX"

