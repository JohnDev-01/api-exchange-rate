FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY apps ./apps

RUN npm install
RUN npm run build:orchestrator

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist/apps/orchestrator-service ./dist/apps/orchestrator-service
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/apps/orchestrator-service/main"]
