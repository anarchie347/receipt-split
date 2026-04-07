// bucket to store static webpage
resource "aws_s3_bucket" "mainpage" {
  bucket_prefix = "reciept-split-website"
  tags = {
    Name = "reciept-split"
  }
}

// Policy for allowing CloudFront access to the bucket
data "aws_iam_policy_document" "origin_mainpage_bucket_policy" {
  statement {
    sid = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      type = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
        "s3:GetObject",
    ]

    resources = [
        "${aws_s3_bucket.mainpage.arn}/*"
    ]

    condition {
      test = "ArnLike"
      variable = "AWS:SourceArn"
      values = [aws_cloudfront_distribution.main.arn]
    }
  }
}

// attach above policy doc to bucket
resource "aws_s3_bucket_policy" "mainpage_policy" {
  bucket = aws_s3_bucket.mainpage.bucket
  policy = data.aws_iam_policy_document.origin_mainpage_bucket_policy.json
}


locals {
  upload_folder = "${path.root}/../src/s3/mainpage/dist/"
  // Files uploaded through terraform dont correctly configure the metadata type
  // https://stackoverflow.com/questions/18296875/amazon-s3-downloads-index-html-instead-of-serving
  // may need to add ore types in the future
  mime_types = {
    ".html" = "text/html"
    ".css" = "text/css"
    ".js" = "application/javascript"
  }
}
resource "aws_s3_object" "name" {
  for_each = fileset(local.upload_folder, "**")
  bucket = aws_s3_bucket.mainpage.bucket
  key = "public/${each.value}"
  source = "${local.upload_folder}/${each.value}"
  content_type = lookup(local.mime_types,regex("\\.[^.]+$", each.value), "application/octet-stream")
  etag = filebase64sha256("${local.upload_folder}/${each.value}")
}
