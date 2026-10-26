import type {Pool} from 'pg';
import {CustomerAuthError} from './customer-auth.js';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function readCustomerAddresses(pool:Pool,customerId:string){
  const r=await pool.query(`SELECT id,label,formatted_address,latitude::float AS latitude,longitude::float AS longitude,
    is_default FROM tuscanini.customer_addresses WHERE customer_id=$1 ORDER BY created_at DESC LIMIT 30`,[customerId]);
  return r.rows;
}
export async function saveCustomerAddress(pool:Pool,customerId:string,input:unknown){
  if(!input||typeof input!=='object'||Array.isArray(input))throw new CustomerAuthError('Invalid address.',400);
  const d=input as Record<string,unknown>;
  if(typeof d.label!=='string'||d.label.trim().length<1||d.label.trim().length>40||
     typeof d.formatted_address!=='string'||d.formatted_address.trim().length<1||
     d.formatted_address.trim().length>300||typeof d.latitude!=='number'||
     typeof d.longitude!=='number'||!Number.isFinite(d.latitude)||!Number.isFinite(d.longitude)||
     d.latitude<22||d.latitude>32||d.longitude<24||d.longitude>37)
    throw new CustomerAuthError('Invalid address.',400);
  const r=await pool.query(`INSERT INTO tuscanini.customer_addresses
    (customer_id,label,formatted_address,latitude,longitude)
    VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [customerId,d.label.trim(),d.formatted_address.trim(),d.latitude,d.longitude]);
  return r.rows[0];
}
export async function deleteCustomerAddress(pool:Pool,customerId:string,id:string){
  if(!uuid.test(id))throw new CustomerAuthError('Invalid address.',400);
  const r=await pool.query('DELETE FROM tuscanini.customer_addresses WHERE customer_id=$1 AND id=$2',[customerId,id]);
  return {ok:!!r.rowCount};
}
