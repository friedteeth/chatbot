import os

from aws_cdk import (
    Stack,
    BundlingOptions,
    Duration,
    aws_lambda as aws_lambda,
    CfnOutput,
)
from constructs import Construct

class ChatbotStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

        if OPENAI_API_KEY == "":
            raise ValueError("Need to set the OPENAI_API_KEY environment variable")

        chatbot_lambda = aws_lambda.Function(
            self, "Chatbot",
            timeout=Duration.seconds(30),
            runtime=aws_lambda.Runtime.PYTHON_3_11,
            handler="app.handler",
            code=aws_lambda.Code.from_asset("lambdas/chatbot", bundling=BundlingOptions(
                image=aws_lambda.Runtime.PYTHON_3_11.bundling_image,
                command=[
                    "bash", "-c",
                    "pip install -r requirements.txt --platform manylinux2014_x86_64 -t /asset-output --only-binary=:all: && cp -au . /asset-output"
                ],
                platform="manylinux2014_x86_64",
            )),
            environment={"OPENAI_API_KEY": OPENAI_API_KEY},
        )
        function_url = chatbot_lambda.add_function_url(
            auth_type=aws_lambda.FunctionUrlAuthType.NONE,
            cors=aws_lambda.FunctionUrlCorsOptions(
                allowed_origins=["*"],
                allowed_headers=["content-type"],
            )) 
        CfnOutput(
            self, "ChatbotFunctionUrl",
            value=function_url.url,
            description="Chatbot Function Url",
            export_name="ChatbotUrl",
        )
