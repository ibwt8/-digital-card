FROM node:24-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*


FROM base AS build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate --config ./prisma7.config.ts
RUN npm run build


FROM build AS init

CMD ["sh", "-c", "npx prisma migrate deploy --config ./prisma7.config.ts && npx prisma db seed --config ./prisma7.config.ts"]


FROM base AS runtime

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=build --chown=node:node /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]