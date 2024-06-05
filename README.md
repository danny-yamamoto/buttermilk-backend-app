```bash
aws configure sso
# Set AWS environment variables
vi ~/.aws/credentials
cat ~/.aws/credentials
cat ~/.aws/config # Get prifile
npx ampx sandbox --profile <profile-name>
```

## Install SQL Client

```bash
sudo apt update
sudo apt install -y default-mysql-client
```

## Display table list

```sql
SHOW TABLES;
```

```bash
# Run app
npx nest start hoge
# Add new terminal
curl -i http://localhost:3000/hoge
```

```bash
npm install prisma
npx prisma init
npx prisma migrate dev --name init
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

```bash: logs
node ➜ /workspaces/buttermilk-backend-app (main) $ npx ampx sandbox --profile hoge-9999

  Amplify Sandbox

  Identifier:   node
  Stack:        amplify-buttermilkbackendapp-node-sandbox-xxxx
```

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
