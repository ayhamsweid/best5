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

## Build + Preview

1. `npm run build`
2. `npm run preview`

## Routing

- Public: `/ar`, `/en`, `/ar/blog`, `/en/blog`, `/ar/category/:slug`, `/ar/search?q=...`, `/ar/compare/:slug`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/posts`, `/admin/categories`, `/admin/tags`, `/admin/logs`, `/admin/settings`
- API: `/api/*`
