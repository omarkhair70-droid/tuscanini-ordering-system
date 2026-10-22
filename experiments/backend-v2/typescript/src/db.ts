import { Pool } from 'pg';

export function verifyDisposableLocalDatabase(): void {
  const approved = process.env.TUSCANINI_SPIKE_ONLY === 'yes'
    && process.env.POSTGRES_DB === 'tuscanini_spike'
    && ['localhost', '127.0.0.1'].includes(process.env.POSTGRES_HOST ?? '127.0.0.1');
  if (!approved) {
    throw new Error('REFUSED: only explicit loopback tuscanini_spike test DB is permitted.');
  }
}

export function openDisposablePool(): Pool {
  verifyDisposableLocalDatabase();
  // No DATABASE_URL lookup: these tests cannot inadvertently use an inherited
  // remote merchant DSN. The designated DB user must be a disposable test role.
  return new Pool({
    host: process.env.POSTGRES_HOST ?? '127.0.0.1',
    port: Number(process.env.POSTGRES_PORT ?? '5432'),
    database: 'tuscanini_spike',
    user: process.env.POSTGRES_USER ?? 'spike',
    password: process.env.POSTGRES_PASSWORD ?? '',
    max: 12,
    connectionTimeoutMillis: 5_000,
  });
}
