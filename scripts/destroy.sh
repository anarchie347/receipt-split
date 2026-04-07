#!/bin/bash

# Set cwd to project root
cd "$(dirname "${BASH_SOURCE[0]}")"
cd ..

# terraform
cd deployment
terraform destroy "$@"
cd ..
