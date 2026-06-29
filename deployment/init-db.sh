#!/bin/sh
set -eu

if [ -z "${DB_APP_PASSWORD:-}" ]; then
  echo "DB_APP_PASSWORD is required" >&2
  exit 1
fi

role_exists="$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -tAc "SELECT 1 FROM pg_roles WHERE rolname = 'best5_app'")"
if [ "$role_exists" != "1" ]; then
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
    -c "CREATE ROLE best5_app LOGIN"
fi

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=app_password="$DB_APP_PASSWORD" <<'SQL'
ALTER ROLE best5_app LOGIN PASSWORD :'app_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT CONNECT ON DATABASE besiktas TO best5_app;
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
