import { readFile } from 'node:fs/promises';
import { openDisposablePool } from './db.js';
import { startLocalSimulation } from './http.js';

const pool=openDisposablePool();
async function main(){
  // Never drop any tables in the interactive studio. Only isolated unit tests reset.
  const found=await pool.query<{name:string|null}>("SELECT to_regclass('spike_ts.orders')::text AS name");
  if(!found.rows[0]?.name){
    const sql=await readFile(new URL('../schema.sql',import.meta.url),'utf8');
    await pool.query(sql);
  }
  const migration=await readFile(new URL('../schema-menu.sql',import.meta.url),'utf8');
  await pool.query(migration);
  await pool.query(`
    INSERT INTO spike_ts.catalog_item(sku,name,unit_price_cents,available)
    VALUES ('TUSC_DEMO_01','كريب توسكانيني / تجربة',9500,true),
      ('TUSC_DEMO_02','بيتزا توسكانيني / تجربة',18000,true),
      ('TUSC_DEMO_03','مشروب / تجربة',3500,true)
    ON CONFLICT(sku) DO NOTHING
  `);
  const server=await startLocalSimulation(pool);
  console.log('\nTUSCANINI ORDER ROOM — '+server.baseUrl+'/studio');
  console.log('Open this localhost URL in two browser windows: customer + operator.');
  console.log('Only disposable localhost Postgres tuscanini_spike is used. Ctrl+C exits.');
  let closing=false;
  const stop=async()=>{if(closing)return;closing=true;await server.close();await pool.end();};
  process.once('SIGINT',()=>{void stop()});
  process.once('SIGTERM',()=>{void stop()});
}
main().catch(async error=>{console.error(error);await pool.end();process.exitCode=1;});
