locals {
  mainpage_origin_id = "Mainpage S3"
  api_origin_id = "Api Gateway"
}

resource "aws_cloudfront_origin_access_control" "s3_access" {
  name = "s3-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}
resource "aws_cloudfront_distribution" "main" {
  enabled = true
  is_ipv6_enabled = true
  default_root_object = "index.html"
  origin {
    domain_name = aws_s3_bucket.mainpage.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_access.id
    origin_id = local.mainpage_origin_id
    origin_path = "/public"
  }

  origin {
    domain_name = replace(aws_apigatewayv2_api.api.api_endpoint, "/^https?://([^/]*).*/", "$1") //removec http(s):// from url to get domain 
    origin_id = local.api_origin_id
    custom_origin_config {
      http_port = "80"
      https_port = "443"
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  # S3
  default_cache_behavior {
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CacheOptimized (Reccomended for S3)
    target_origin_id = local.mainpage_origin_id

    viewer_protocol_policy = "redirect-to-https"
    allowed_methods = ["GET", "HEAD"]
  cached_methods = ["GET", "HEAD"]
  compress = true
  }

  # API Gateway
  ordered_cache_behavior {
    path_pattern = "/api/*"
    target_origin_id = local.api_origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods = ["GET", "HEAD"]
    compress = true
    cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # Caching disabled
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # AllViewerExceptHostHeader 
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