resource "aws_lambda_function" "api" {
  function_name = "receipt-split-api"
  runtime = "nodejs22.x"
  handler = "api.hanlder"

  filename = "${path.root}/../src/lambda/api/api.zip"
  source_code_hash = filebase64sha256("${path.root}/../src/lambda/api/api.zip")

  role = aws_iam_role.lambda_api_role.arn

  environment {
    
  }

}

resource "aws_iam_role" "lambda_api_role" {
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy_doc.json
  description = "Role with permissions for receipt-split-api"
  name = "receipt-split-api"
}

resource "aws_iam_role_policy_attachment" "lambda_api_attach_logs" {
  role = aws_iam_role.lambda_api_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_permission" "api_api_access" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}