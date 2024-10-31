# Chatbot webapp

React app that can parse voice recording into text and request an LLM response

## Requirements

- NodeJS
- npm/yarn

## Setup

Install dependencies
```bash
yarn install
```

Copy and rename the `.env.sample` file to `.env`, and set the variable `REACT_APP_CHATBOT_API`
with the function url given by the backend

Finally run the application with
```bash
yarn start
```