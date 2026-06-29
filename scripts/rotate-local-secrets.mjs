import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const secret = (bytes = 48) => randomBytes(bytes).toString('base64url');
const databaseAdminPassword = secret(32);
const databaseAppPassword = secret(32);
const accessSecret = secret();
const refreshSecret = secret();

await writeFile(
  new URL('../.env', import.meta.url),
  [
    `DB_ADMIN_PASSWORD=${databaseAdminPassword}`,
    `DB_APP_PASSWORD=${databaseAppPassword}`,
    `JWT_ACCESS_SECRET=${accessSecret}`,
    `JWT_REFRESH_SECRET=${refreshSecret}`,
    'COOKIE_SECURE=false',
    ''
  ].join('\n'),
  { encoding: 'utf8', mode: 0o600 }
);

await writeFile(
  new URL('../server/.env', import.meta.url),
  [
    `DATABASE_URL=postgresql://best5_app:${encodeURIComponent(databaseAppPassword)}@127.0.0.1:5432/besiktas`,
    `MIGRATION_DATABASE_URL=postgresql://best5_user:${encodeURIComponent(databaseAdminPassword)}@127.0.0.1:5432/besiktas`,
    `JWT_ACCESS_SECRET=${accessSecret}`,
    `JWT_REFRESH_SECRET=${refreshSecret}`,
    'JWT_ISSUER=best5-api',
    'JWT_AUDIENCE=best5-admin',
    'JWT_ACCESS_TTL=900',
    'JWT_REFRESH_TTL=604800',
    'COOKIE_DOMAIN=',
    'COOKIE_SECURE=false',
    'CORS_ORIGINS=http://localhost:3000',
    'TRUST_PROXY_HOPS=0',
    'UPLOAD_DIR=uploads',
    'ENABLE_DB_TOOLS=0',
    ''
  ].join('\n'),
  { encoding: 'utf8', mode: 0o600 }
);

const containerName = process.env.BEST5_DB_CONTAINER || 'best5-db-1';
const inspect = spawnSync('docker', ['inspect', containerName], { stdio: 'ignore' });
if (inspect.status === 0) {
  const sql = `
DO $role$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'best5_app') THEN
    CREATE ROLE best5_app LOGIN;
  END IF;
END
$role$;
ALTER ROLE best5_app LOGIN PASSWORD '${databaseAppPassword}' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
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
ALTER ROLE best5_user PASSWORD '${databaseAdminPassword}';
`;
  const applied = spawnSync(
    'docker',
    ['exec', '-i', containerName, 'psql', '-v', 'ON_ERROR_STOP=1', '-U', 'best5_user', '-d', 'besiktas'],
    { input: sql, encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit'] }
  );
  if (applied.status !== 0) {
    throw new Error('Secrets were written, but applying database credentials failed');
  }
  console.log('Generated and applied independent local database and JWT secrets without printing their values.');
} else {
  console.log('Generated local secrets. Start PostgreSQL, then run this script again to apply new database credentials.');
}
