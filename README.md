## Description

This repository is a sample using Amplify Gen 2, NestJS and Prisma.

## Install SQL Client in a local container

```bash
sudo apt update
sudo apt install -y default-mysql-client
```

### Display table list

```sql
SHOW TABLES;
```

## Run backend API

```bash
# Run app
npx nest start hoge
# Add new terminal
curl -i http://localhost:3000/hoge
```

```bash
# Run app
npx nest start todo
```

```bash
# POST
# Create
curl -i -X POST -H 'Content-Type: application/json' -d '{"content" : "apple"}' localhost:3000/todo

# GET
# Findone
curl -i -X GET localhost:3000/todo/1
```

### Examples

```bash: logs
node ➜ /workspaces/buttermilk-backend-app (main) $ curl -i -X POST -H 'Content-Type: application/json' -d '{"content" : "apple"}' localhost:3000/todo
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 26
ETag: W/"1a-bGdeTm2pUnJ8LzJ94glaBxzKJVI"
Date: Wed, 05 Jun 2024 04:32:24 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"content":"apple"}
node ➜ /workspaces/buttermilk-backend-app (main) $ curl -i -X GET localhost:3000/todo/1
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 26
ETag: W/"1a-bGdeTm2pUnJ8LzJ94glaBxzKJVI"
Date: Wed, 05 Jun 2024 04:32:30 GMT
Connection: keep-alive
Keep-Alive: timeout=5

node ➜ /workspaces/buttermilk-backend-app (main)
```

## Set up Prisma and migration

```bash
npm install prisma
npx prisma init
npx prisma migrate dev --name init
```

### Examples

```bash: logs
node ➜ /workspaces/buttermilk-backend-app (main) $ npx prisma migrate dev --name init
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "kbpAmpxDb" at "amplify-buttermilkbackendap-kbprdsinstance0000-yyyy.xxxx.ap-northeast-1.rds.amazonaws.com:3306"

Applying migration `20240605043023_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240605043023_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.15.0) to ./node_modules/@prisma/client in 78ms


node ➜ /workspaces/buttermilk-backend-app (main)
```

## Bootstrap your AWS account

```bash
export MY_PROFILE_NAME=""
echo $MY_PROFILE_NAME
aws configure sso
# Set AWS environment variables
vi ~/.aws/credentials
cat ~/.aws/credentials
# Get profile-name from AWS access portal
cat ~/.aws/config
# Set secrets
npx ampx sandbox secret set BACKEND_API_TAG --profile ${MY_PROFILE_NAME}
npx ampx sandbox secret list --profile ${MY_PROFILE_NAME}
# Run sandbox
npx ampx sandbox --profile ${MY_PROFILE_NAME} --identifier xxxx
# Delete sandbox
npx ampx sandbox delete --profile ${MY_PROFILE_NAME} --identifier xxxx
```

### Examples

```bash: logs
node ➜ /workspaces/buttermilk-backend-app (main) $ npx ampx sandbox --profile hoge-9999

  Amplify Sandbox

  Identifier:   node
  Stack:        amplify-buttermilkbackendapp-node-sandbox-xxxx
```

### Add another terminal to run

```bash: logs
node ➜ /workspaces/buttermilk-backend-app (main) $ npx nest start todo
webpack 5.90.1 compiled successfully in 22426 ms
[Nest] 10689  - 06/05/2024, 4:32:11 AM     LOG [NestFactory] Starting Nest application...
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [InstanceLoader] AppModule dependencies initialized +61ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [InstanceLoader] HogeModule dependencies initialized +1ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [InstanceLoader] TodoModule dependencies initialized +0ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [RoutesResolver] HogeController {/hoge}: +45ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [RouterExplorer] Mapped {/hoge, GET} route +3ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [RoutesResolver] TodoController {/todo}: +0ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [RouterExplorer] Mapped {/todo, POST} route +1ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [RouterExplorer] Mapped {/todo, GET} route +1ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [RouterExplorer] Mapped {/todo/:id, GET} route +1ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [RouterExplorer] Mapped {/todo/:id, PATCH} route +1ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [RouterExplorer] Mapped {/todo/:id, DELETE} route +0ms
[Nest] 10689  - 06/05/2024, 4:32:12 AM     LOG [NestApplication] Nest application successfully started +462ms
```

## Reference

- EC2 [^4]
- RDS [^3]
- ECR [^2]
- ECS [^1]

[^1]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html

[^2]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecr-readme.html

[^3]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds-readme.html

[^4]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html

```bash
# README at : https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/create-container-image.html#create-container-image-create-image
export AWS_ACCOUNT_ID=""
export AWS_DEFAULT_REGION="ap-northeast-1"
echo $AWS_ACCOUNT_ID
echo $AWS_DEFAULT_REGION

docker tag hello-world ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/hello-repository

aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com

docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/hello-repository
```
