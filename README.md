# Best5

Public site + Admin panel + NestJS API in a single repo.

## Local Development

**Frontend**
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

**Backend**
1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and update values
4. Start a local PostgreSQL instance that is bound only to loopback, then set `DATABASE_URL` and `MIGRATION_DATABASE_URL`
5. Run migrations: `npm run prisma:migrate`
6. Start API: `npm run start:dev`

Do not use a second Compose file from inside `server/`. The hardened root Compose stack is the only supported container deployment.

## Containers

The root `docker-compose.yml` runs:

- `db`: PostgreSQL 16 on the internal Compose network only
- `api`: NestJS API on the internal Compose network only
- `renderer`: server-side rendering on the internal Compose network only
- `web`: the only published service, bound to `127.0.0.1:3000`

First run:

```bash
docker compose up -d --build
```

Normal runs:

```bash
docker compose up -d
```

The API applies committed Prisma migrations during startup. Database backups must be encrypted, stored outside Git, and restored through an operator-controlled process rather than a web endpoint or a repository-mounted raw data directory.

To intentionally reset the local Compose database, first confirm that no data must be retained, then remove the `postgres_data` volume through your normal Docker administration workflow and start the stack again.

## Security

- Never commit `.env`, database dumps, raw PostgreSQL data directories, or uploaded private media.
- Generate independent random values for every secret. `npm run security:rotate-local` writes ignored `.env` files and `.secrets/` files; Compose mounts the latter into containers as Docker secrets rather than exposing values in container configuration.
- Terminate HTTPS at the trusted reverse proxy. Production cookies are configured as `Secure`.
- Keep ports `4000` and `5432` private; only the reverse proxy should reach them.
- Review and rotate credentials after any suspected disclosure.

## Build + Preview

1. `npm run build`
2. `npm run preview`

## Routing

- Public: `/ar`, `/en`, `/ar/blog`, `/en/blog`, `/ar/category/:slug`, `/ar/search?q=...`, `/ar/compare/:slug`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/posts`, `/admin/categories`, `/admin/tags`, `/admin/logs`, `/admin/settings`
- API: `/api/*`
