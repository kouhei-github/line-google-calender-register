FROM node:20
WORKDIR /app

COPY ./express/package.json /app
COPY ./express/package-lock.json /app
RUN npm install --frozen-lockfile

COPY ./express /app

RUN npm run build  # TypeScriptを使用している場合

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.3 /lambda-adapter /opt/extensions/lambda-adapter

EXPOSE 8080
