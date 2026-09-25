#!/bin/sh
set -eu

read_secret() {
  secret_name="$1"
  secret_file="$2"
  if [ ! -r "$secret_file" ]; then
    echo "$secret_name secret file is missing or unreadable" >&2
    exit 1
  fi
  secret_value="$(cat "$secret_file")"
  if [ -z "$secret_value" ]; then
    echo "$secret_name secret is empty" >&2
    exit 1
  fi
  printf '%s' "$secret_value"
}

urlencode() {
  node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$1"
}

db_migration_password="$(read_secret DB_MIGRATION_PASSWORD "${DB_MIGRATION_PASSWORD_FILE:-/run/secrets/db_migration_password}")"
db_app_password="$(read_secret DB_APP_PASSWORD "${DB_APP_PASSWORD_FILE:-/run/secrets/db_app_password}")"
export JWT_ACCESS_SECRET="$(read_secret JWT_ACCESS_SECRET "${JWT_ACCESS_SECRET_FILE:-/run/secrets/jwt_access_secret}")"
export JWT_REFRESH_SECRET="$(read_secret JWT_REFRESH_SECRET "${JWT_REFRESH_SECRET_FILE:-/run/secrets/jwt_refresh_secret}")"
export SSR_INTERNAL_TOKEN="$(read_secret SSR_INTERNAL_TOKEN "${SSR_INTERNAL_TOKEN_FILE:-/run/secrets/ssr_internal_token}")"

db_host="${DB_HOST:-db}"
db_port="${DB_PORT:-5432}"
db_name="${DB_NAME:-besiktas}"
db_app_user="${DB_APP_USER:-best5_app}"
db_migration_user="${DB_MIGRATION_USER:-best5_user}"
runtime_url="postgresql://${db_app_user}:$(urlencode "$db_app_password")@${db_host}:${db_port}/${db_name}"
migration_url="postgresql://${db_migration_user}:$(urlencode "$db_migration_password")@${db_host}:${db_port}/${db_name}"

unset db_migration_password db_app_password
DATABASE_URL="$migration_url" node node_modules/prisma/build/index.js migrate deploy
unset migration_url
export DATABASE_URL="$runtime_url"
unset runtime_url

exec node dist/main.js
