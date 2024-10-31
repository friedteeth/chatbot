# Chatbot backend

This is a sample chatbot app that leverages LLM OpenAI to generate text and voice response

## Requirements

- OpenAI API key
- Docker
- Python 3.11
- AWS CDK
- AWS CLI

## Setup

Setup your AWS credentials either by using `aws configure` or by setting the required environment variables
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
```

Also set an environment variable for your OpenAI API key
```
OPENAI_API_KEY
```

Create python virtual environment and activate it
```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install requirements
```bash
pip install -r requirements.txt
# The following are only required if running tests
pip install -r requirements-dev.txt
pip install -r lambdas/chatbot/requirements.txt
```

Deploy the lambda and get the function url
```bash
cdk deploy
```

Output
```
Outputs:
ChatbotStack.ChatbotFunctionUrl = https://sample.lambda-url.region.on.aws/
```

Save the function url and assign it to the `REACT_APP_CHATBOT_API` environement variable in the webapp (should be assigned inside of `.env`)