FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run prisma:generate
RUN npm run build
RUN npm prune --omit=dev && npm cache clean --force
RUN mkdir -p /app/uploads && chown -R node:node /app
USER node
EXPOSE 4000
CMD ["sh", "-c", "DATABASE_URL=\"$MIGRATION_DATABASE_URL\" npx prisma migrate deploy && node dist/main.js"]
