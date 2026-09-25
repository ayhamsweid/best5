FROM node:25-bookworm-slim
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
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
RUN chmod 755 /app/docker-entrypoint.sh \
  && mkdir -p /app/uploads \
  && chown -R node:node /app
USER node
EXPOSE 4000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
