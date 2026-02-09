import { ForbiddenException, Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';
import fs from 'fs';

const execFileAsync = promisify(execFile);

type DbConfig = {
  host: string;
  port: string;
  user: string;
  password?: string;
  database: string;
};

const parseDatabaseUrl = (): DbConfig => {
  const url = new URL(process.env.DATABASE_URL || '');
  return {
    host: url.hostname || 'localhost',
    port: url.port || '5432',
    user: decodeURIComponent(url.username || 'postgres'),
    password: url.password ? decodeURIComponent(url.password) : undefined,
    database: url.pathname.replace('/', '') || 'postgres'
  };
};

@Injectable()
export class DbToolsService {
  private ensureEnabled() {
    if (process.env.ENABLE_DB_TOOLS !== '1') {
      throw new ForbiddenException('Database tools disabled');
    }
  }

  async backup() {
    this.ensureEnabled();
    const config = parseDatabaseUrl();
    const filename = `backup-${Date.now()}.sql`;
    const filePath = path.join(os.tmpdir(), filename);
    const env = { ...process.env, PGPASSWORD: config.password || '' };

    await execFileAsync(
      'pg_dump',
      ['-h', config.host, '-p', config.port, '-U', config.user, '-d', config.database, '-f', filePath, '--format=plain'],
      { env }
    );

    return { filePath, filename };
  }

  async restore(filePath: string) {
    this.ensureEnabled();
    const config = parseDatabaseUrl();
    const env = { ...process.env, PGPASSWORD: config.password || '' };

    if (!fs.existsSync(filePath)) {
      throw new Error('Backup file not found');
    }

    await execFileAsync(
      'psql',
      ['-h', config.host, '-p', config.port, '-U', config.user, '-d', config.database, '-v', 'ON_ERROR_STOP=1', '-f', filePath],
      { env }
    );
  }
}
