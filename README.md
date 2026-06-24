# Besiktas City Guide

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
4. Start Postgres: `docker compose up -d db`
5. Run migrations: `npx prisma migrate dev`
6. Start API: `npm run start:dev`
7. API docs: `http://localhost:4000/api/docs`

## Containers

The root `docker-compose.yml` runs:

- `db`: PostgreSQL 16, initialized from `db_raw_data_backup`
- `api`: NestJS API on `http://localhost:4000`
- `web`: built Vite app served by nginx on `http://localhost:3000`

First run:

```bash
docker compose --profile restore run --rm db-restore
docker compose up -d --build
```

Normal runs after the database volume exists:

```bash
docker compose up -d
```

Reset the restored database volume and re-import the backup:

```bash
docker compose down -v
docker compose --profile restore run --rm db-restore
docker compose up -d --build
```

## Build + Preview

1. `npm run build`
2. `npm run preview`

## Routing

- Public: `/ar`, `/en`, `/ar/blog`, `/en/blog`, `/ar/category/:slug`, `/ar/search?q=...`, `/ar/compare/:slug`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/posts`, `/admin/categories`, `/admin/tags`, `/admin/logs`, `/admin/settings`
- API: `/api/*`
