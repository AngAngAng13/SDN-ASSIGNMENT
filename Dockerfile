FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build:server
RUN npm run build:client

FROM node:24-alpine AS production
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY package.json package-lock.json ./

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src/views ./src/views
COPY --from=builder /app/src/public ./src/public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/app.js"]