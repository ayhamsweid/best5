FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev && npm cache clean --force

FROM node:20-alpine AS renderer
WORKDIR /app
ENV NODE_ENV=production
RUN apk upgrade --no-cache \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/dist-server ./dist-server
COPY --chown=node:node ssr-server.mjs ./
USER node
EXPOSE 3001
CMD ["node", "ssr-server.mjs"]

FROM nginxinc/nginx-unprivileged:1.31.6-alpine3.24@sha256:6a23acdfca2b9cfbcec61419e3f1426bcbedb91362f2f19306a8567423bb4612 AS web
USER root
RUN apk upgrade --no-cache
COPY deployment/container-nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 --from=build /app/dist /usr/share/nginx/html
USER 101

EXPOSE 8080
