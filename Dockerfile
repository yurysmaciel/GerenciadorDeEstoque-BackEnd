FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

RUN npx prisma generate
RUN npm run build

RUN cp -r src/generated dist/generated

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

CMD ["node", "dist/server.js"]