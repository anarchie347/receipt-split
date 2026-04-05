resource "aws_cloudfront_origin_access_control" "s3-access" {
  name = "s3-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

# resource "aws_cloudfront_cache_policy" "default" {
#   name = "default"
#   min_ttl = 1
#   max_ttl = 500
#   default_ttl = 50
#   parameters_in_cache_key_and_forwarded_to_origin {
    
#   }
# }

resource "aws_cloudfront_distribution" "main" {
  enabled = true
  is_ipv6_enabled = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.mainpage.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3-access.id
    origin_id = "Mainpage S3"
  }

  default_cache_behavior {
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed CacheOptimized (Reccomended for S3)
    target_origin_id = "Mainpage S3"

    viewer_protocol_policy = "redirect-to-https"
    allowed_methods = ["GET", "HEAD"]
  cached_methods = ["GET", "HEAD"]
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations = []
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}