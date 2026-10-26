import {readFile} from 'node:fs/promises';
import {createPool} from './db.js';

const pool=createPool();
try {
  const client=await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock(770001, 2026)');
    try {
      for (const name of ['schema.sql','schema-menu.sql','schema-customer.sql']) {
        const sql=await readFile(new URL('../migrations/'+name,import.meta.url),'utf8');
        await client.query(sql);
      }
      console.log('Tuscanini additive migrations complete');
    } finally { await client.query('SELECT pg_advisory_unlock(770001, 2026)'); }
  } finally {client.release();}
} finally {await pool.end();}
