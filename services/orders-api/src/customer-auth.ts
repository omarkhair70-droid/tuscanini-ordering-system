import {createHash,createHmac,randomBytes,randomInt,timingSafeEqual} from 'node:crypto';
import type {Pool} from 'pg';

export class CustomerAuthError extends Error {
  constructor(message:string,public status:number){super(message);}
}
const EMAIL=/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
const TOKEN=/^[A-Za-z0-9_-]{40,60}$/;
const OTP=/^\d{6}$/;
function cleanEmail(raw:unknown):string{
  if(typeof raw!=='string')throw new CustomerAuthError('Invalid email.',400);
  const email=raw.trim().toLowerCase();
  if(email.length>254||!EMAIL.test(email))throw new CustomerAuthError('Invalid email.',400);
  return email;
}
function tokenHash(token:string){return createHash('sha256').update(token).digest('hex');}
function otpHash(pepper:string,email:string,code:string){
  return createHmac('sha256',pepper).update(email+'|'+code).digest('hex');
}
export type CustomerAuthConfig={
  enabled:boolean; pepper:string;
  sendOtp?:(email:string,code:string)=>Promise<void>;
};
export async function requestCustomerOtp(pool:Pool,config:CustomerAuthConfig,input:unknown){
  if(!config.enabled||config.pepper.length<32||!config.sendOtp)
    throw new CustomerAuthError('Customer sign-in is not configured.',503);
  const email=cleanEmail(input);
  const code=String(randomInt(0,1_000_000)).padStart(6,'0');
  const digest=otpHash(config.pepper,email,code);
  // Atomic upsert prevents duplicate/concurrent emails, max 5 sends/hour,
  // and 60-second resend delay even if a request is retried.
  const issued=await pool.query<{code_hash:string}>(`
    INSERT INTO tuscanini.customer_otp_challenges(email,code_hash,expires_at)
      VALUES ($1,$2,now()+interval '10 minutes')
    ON CONFLICT(email) DO UPDATE SET
      code_hash=EXCLUDED.code_hash,expires_at=EXCLUDED.expires_at,
      issued_at=now(),attempts=0,
      hourly_count=CASE WHEN tuscanini.customer_otp_challenges.hourly_window<now()-interval '1 hour'
        THEN 1 ELSE tuscanini.customer_otp_challenges.hourly_count+1 END,
      hourly_window=CASE WHEN tuscanini.customer_otp_challenges.hourly_window<now()-interval '1 hour'
        THEN now() ELSE tuscanini.customer_otp_challenges.hourly_window END
    WHERE tuscanini.customer_otp_challenges.issued_at<now()-interval '60 seconds'
      AND (tuscanini.customer_otp_challenges.hourly_window<now()-interval '1 hour'
        OR tuscanini.customer_otp_challenges.hourly_count<5)
    RETURNING code_hash`,[email,digest]);
  if(!issued.rowCount)return {ok:true};
  try{await config.sendOtp(email,code);}
  catch {
    await pool.query('DELETE FROM tuscanini.customer_otp_challenges WHERE email=$1 AND code_hash=$2',[email,digest]);
    throw new CustomerAuthError('Email delivery is unavailable.',503);
  }
  return {ok:true};
}
export async function verifyCustomerOtp(pool:Pool,config:CustomerAuthConfig,inputEmail:unknown,inputCode:unknown){
  if(!config.enabled||config.pepper.length<32||!config.sendOtp)
    throw new CustomerAuthError('Customer sign-in is not configured.',503);
  const email=cleanEmail(inputEmail);
  if(typeof inputCode!=='string'||!OTP.test(inputCode))
    throw new CustomerAuthError('Invalid or expired code.',401);
  const client=await pool.connect();
  try{
    await client.query('BEGIN');
    const challenge=await client.query<{code_hash:string;attempts:number}>(`
      SELECT code_hash,attempts FROM tuscanini.customer_otp_challenges
      WHERE email=$1 AND expires_at>now() FOR UPDATE`,[email]);
    const current=challenge.rows[0];
    if(!current||current.attempts>=5)throw new CustomerAuthError('Invalid or expired code.',401);
    const expected=Buffer.from(current.code_hash,'hex');
    const actual=Buffer.from(otpHash(config.pepper,email,inputCode),'hex');
    if(!timingSafeEqual(expected,actual)){
      await client.query('UPDATE tuscanini.customer_otp_challenges SET attempts=attempts+1 WHERE email=$1',[email]);
      await client.query('COMMIT');
      throw new CustomerAuthError('Invalid or expired code.',401);
    }
    await client.query('DELETE FROM tuscanini.customer_otp_challenges WHERE email=$1',[email]);
    const account=await client.query<{id:string;email:string}>(`
      INSERT INTO tuscanini.customer_accounts(email) VALUES($1)
      ON CONFLICT (lower(btrim(email))) DO UPDATE SET email=EXCLUDED.email
      RETURNING id,email`,[email]);
    const customer=account.rows[0];
    const token=randomBytes(32).toString('base64url');
    await client.query(`INSERT INTO tuscanini.customer_sessions(token_hash,customer_id,expires_at)
      VALUES ($1,$2,now()+interval '30 days')`,[tokenHash(token),customer.id]);
    await client.query('COMMIT');
    return {token,customer};
  }catch(e){
    await client.query('ROLLBACK').catch(()=>{});
    throw e;
  }finally{client.release();}
}
export async function sessionCustomer(pool:Pool,token:unknown):Promise<{id:string;email:string}|null>{
  if(typeof token!=='string'||!TOKEN.test(token))return null;
  const result=await pool.query<{id:string;email:string}>(`
    SELECT a.id,a.email FROM tuscanini.customer_sessions s
    JOIN tuscanini.customer_accounts a ON a.id=s.customer_id
    WHERE s.token_hash=$1 AND s.expires_at>now() LIMIT 1`,[tokenHash(token)]);
  return result.rows[0]??null;
}
export async function revokeCustomerSession(pool:Pool,token:unknown){
  if(typeof token==='string'&&TOKEN.test(token))
    await pool.query('DELETE FROM tuscanini.customer_sessions WHERE token_hash=$1',[tokenHash(token)]);
}
export async function sendResendOtp(email:string,code:string){
  const apiKey=process.env.TUSCANINI_RESEND_API_KEY??'';
  const from=process.env.TUSCANINI_AUTH_FROM_EMAIL??'';
  if(!apiKey.startsWith('re_')||!/^.+@[^@]+\.[^@]+$/.test(from))
    throw new CustomerAuthError('Email delivery is not configured.',503);
  const result=await fetch('https://api.resend.com/emails',{
    method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
    body:JSON.stringify({from,to:[email],subject:'رمز دخول توسكانيني',
      text:'رمز الدخول الخاص بك في توسكانيني: '+code+'\nصالح لمدة 10 دقائق. لا تشارك الرمز مع أي شخص.'}),
    signal:AbortSignal.timeout(8000),
  });
  if(!result.ok)throw new CustomerAuthError('Email delivery is unavailable.',503);
}
