#!/bin/bash

# Set cwd to project root
cd "$(dirname "${BASH_SOURCE[0]}")"
cd ..

# build mainpage
cd src/s3/mainpage
mainpageHash=$(find dist -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum)
npm run build
newMainpageHash=$(find dist -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum)
cd ../../..

# build api
cd src/lambda/api
npm run build
cd ../../..

# terraform
cd deployment
terraform apply "$@"

# create a cache invalidation if mainpage (contents of S3) have changed
if [ "$mainpageHash" != "$newMainpageHash" ]; then
    distID=$(terraform output -raw cloudfront_id)
    echo "Changes detected to mainpage, invalidating Cloudfront Cache"
    aws cloudfront create-invalidation --distribution-id $distID --paths "/*"
fi

# output cloudfront url
url=$(terraform output -raw url)
echo "--------------------------------"
echo "Deployed, URL: " $url
if [ "$mainpageHash" != "$newMainpageHash" ]; then
    echo "A cache invalidation has been issued to CloudFront, this may take a minute to complete"
fi


cd ..
