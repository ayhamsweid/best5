#!/bin/sh
set -eu

read_secret_file() {
  secret_name="$1"
  secret_file="$2"
  if [ ! -r "$secret_file" ]; then
    echo "$secret_name secret file is not readable" >&2
    exit 1
  fi
  cat "$secret_file"
}

if [ -n "${DB_MIGRATION_PASSWORD_FILE:-}" ]; then
  DB_MIGRATION_PASSWORD="$(read_secret_file DB_MIGRATION_PASSWORD "$DB_MIGRATION_PASSWORD_FILE")"
fi
if [ -n "${DB_APP_PASSWORD_FILE:-}" ]; then
  DB_APP_PASSWORD="$(read_secret_file DB_APP_PASSWORD "$DB_APP_PASSWORD_FILE")"
fi

if [ -z "${DB_MIGRATION_PASSWORD:-}" ] || [ -z "${DB_APP_PASSWORD:-}" ]; then
  echo "DB_MIGRATION_PASSWORD and DB_APP_PASSWORD are required" >&2
  exit 1
fi

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=migration_password="$DB_MIGRATION_PASSWORD" \
  --set=app_password="$DB_APP_PASSWORD" \
  --set=db_name="$POSTGRES_DB" <<'SQL'
DO $role$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'best5_user') THEN
    CREATE ROLE best5_user LOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'best5_app') THEN
    CREATE ROLE best5_app LOGIN;
  END IF;
END
$role$;
ALTER ROLE best5_user LOGIN PASSWORD :'migration_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
ALTER ROLE best5_app LOGIN PASSWORD :'app_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT CONNECT, TEMPORARY ON DATABASE :"db_name" TO best5_user;
GRANT USAGE, CREATE ON SCHEMA public TO best5_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO best5_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO best5_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO best5_user;
GRANT CONNECT ON DATABASE :"db_name" TO best5_app;
GRANT USAGE ON SCHEMA public TO best5_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO best5_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO best5_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO best5_app;
ALTER DEFAULT PRIVILEGES FOR ROLE best5_user IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO best5_app;
ALTER DEFAULT PRIVILEGES FOR ROLE best5_user IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO best5_app;
ALTER DEFAULT PRIVILEGES FOR ROLE best5_user IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO best5_app;
SQL

unset DB_MIGRATION_PASSWORD DB_APP_PASSWORD
