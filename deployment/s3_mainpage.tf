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
    sid = "AllowCloudFrontServicePrincipalReadWrite"
    effect = "Allow"

    principals {
      type = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
        "s3:GetObject",
        "s3:PutObject"
    ]

    resources = [
        "${aws_s3_bucket.mainpage.arn}/dist/*"
    ]

    condition {
      test = "StringEquals"
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

