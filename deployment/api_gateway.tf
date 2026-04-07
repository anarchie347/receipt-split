resource "aws_apigatewayv2_api" "api" {
  name = "receipt-split-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "api_lambda" {
  api_id = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  connection_type = "INTERNET"
  description = "Links to API lambda"
  integration_method = "POST"
  payload_format_version = "2.0"
  integration_uri = aws_lambda_function.api.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda" {
  api_id = aws_apigatewayv2_api.api.id
  route_key = "$default" //capture all paths
    target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

resource "aws_apigatewayv2_stage" "api_stage" {
  api_id = aws_apigatewayv2_api.api.id
  name = "$default"
  auto_deploy = true
}