# Receipt Splitter

A simple web app to ease with splitting the costs of a receipt between people.

All deployed on AWS Cloudfront,S3 and Lambda.

This app uses [Veryfi](https://www.veryfi.com) to scan pictures of receipts. To deploy this app you must provide API keys for a Veryfi account. As of writing, the free account rate limit is 100 requests/month. It is not possible to use this app without Veryfi.

# Usage

- Check [dependencies](#Dependencies), ensure they are installed and credentials are setup
- run `scripts/deploy.sh`

Use `-v` or `--verbose` to show outputs of all commands being run, useful for troubleshooting.

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

