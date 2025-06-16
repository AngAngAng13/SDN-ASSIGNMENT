FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build


FROM node:24-alpine AS production
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY package.json package-lock.json ./

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src/views ./dist/views
COPY --from=builder /app/src/public ./dist/public

ENV NODE_ENV=production
EXPOSE 8443

USER root

CMD ["node", "dist/app.js"]
