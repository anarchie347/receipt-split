#!/bin/bash

# Set cwd to project root
cd "$(dirname "${BASH_SOURCE[0]}")"
cd ..

# build mainpage
cd src/s3/mainpage
npm run build
cd ../../..

# build api
cd src/lambda/api
npm run build
cd ../../..

# terraform
cd deployment
terraform apply "$@"
cd ..
