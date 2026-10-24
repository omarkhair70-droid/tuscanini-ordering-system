import { Pool } from 'pg';

export function createPool():Pool {
  const database=process.env.PGDATABASE ?? '';
  const host=process.env.PGHOST ?? '';
  const user=process.env.PGUSER ?? '';
  const password=process.env.PGPASSWORD ?? '';
  if(!host||!user||!password||!/^tuscanini_[a-z0-9_]+$/.test(database)){
    throw new Error('Separate Tuscanini PostgreSQL credentials required; refuse shared/test DB.');
  }
  if(database==='tuscanini_spike' || user==='spike'){
    throw new Error('Refusing disposable spike database or test DB user.');
  }
  return new Pool({
    host,database,user,password,port:Number(process.env.PGPORT??5432),
    max:Math.max(1,Math.min(15,Number(process.env.PGPOOL_MAX??8))),
    connectionTimeoutMillis:5000,idleTimeoutMillis:30000,
    ssl:process.env.PGSSL==='require'?{rejectUnauthorized:true}:undefined,
  });
}
