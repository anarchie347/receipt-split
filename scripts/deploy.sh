#!/bin/bash

# Set cwd to ./scripts
cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../src/s3/mainpage
npm run build
cd ../../..


cd deployment
sudo -E terraform "$@"