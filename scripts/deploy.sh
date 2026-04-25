#!/bin/bash


VERBOSE=false
[[ "$*" == *"-v"* || "$*" == *"--verbose"* ]] && VERBOSE=true

# save original file descriptor for stdout
exec 3>&1

# conditionally disable output if not VERBOSE
disable_output() {
    if ! $VERBOSE; then
        exec 1>/dev/null
    fi
}
# re-enable output
enable_output() {
    exec 1>&3
}
# enable output, echo, re-disable
output() {
    enable_output
    echo $1
    disable_output
}


disable_output

# Set cwd to project root
cd "$(dirname "${BASH_SOURCE[0]}")"
cd ..


###########
## START ##
###########



# build mainpage
output "Building mainpage"
cd src/s3/mainpage
mainpageHash=$(find dist -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum)
npm ci
npm run build
newMainpageHash=$(find dist -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum)
cd ../../..

# build api
output "Building api"
cd src/lambda/api
npm ci
npm run build
cd ../../..

# terraform
output "Initialising Terraform"
cd deployment
terraform init
output "Deploying with Terraform"
terraform apply -auto-approve

# create a cache invalidation if mainpage (contents of S3) have changed
if [ "$mainpageHash" != "$newMainpageHash" ]; then
    distID=$(terraform output -raw cloudfront_id)
    output "Changes detected to mainpage, invalidating Cloudfront Cache"
    aws cloudfront create-invalidation --distribution-id $distID --paths "/*"
fi

# output cloudfront url
enable_output
url=$(terraform output -raw url)
echo "--------------------------------"
echo "Completed!"
echo "URL: " $url
if [ "$mainpageHash" != "$newMainpageHash" ]; then
    echo "A cache invalidation has been issued to CloudFront, this may take a minute to complete"
fi


cd ..
