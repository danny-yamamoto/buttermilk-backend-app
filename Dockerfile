# ベースイメージとして Node.js の公式イメージを使用
#FROM node:18-alpine
#FROM node:21.7-alpine
FROM public.ecr.aws/docker/library/node:20.14.0-alpine3.20 AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install
RUN npm install -g @nestjs/cli

# アプリケーションのソースコードをコピー
COPY . .

# Prisma の設定
#RUN npx prisma generate

# ビルド
#RUN npm run build
RUN nest build

# アプリケーションのポートを設定
EXPOSE 3000

# アプリケーションを起動
CMD ["node", "dist/main.js"]
