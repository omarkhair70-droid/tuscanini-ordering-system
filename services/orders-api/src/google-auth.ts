/** Google OpenID Connect ID-token verification and Oracle-owned sessions.
 * The browser NEVER supplies claims or customer IDs directly to this service.
 * Google's signing JWKs rotate; only HTTPS keys at Google's documented URL
 * are trusted, with cache bounded to 10 minutes and failures closed.
 */
import {createHash,createPublicKey,randomBytes,verify as verifySignature} from 'node:crypto';
import type {Pool} from 'pg';
import {CustomerAuthError} from './customer-auth.js';

export type GoogleAuthConfig={enabled:boolean;clientId:string};
type JwtClaims={iss?:unknown;aud?:unknown;sub?:unknown;email?:unknown;
  email_verified?:unknown;exp?:unknown;iat?:unknown;nonce?:unknown;azp?:unknown};
type GoogleProfile={subject:string;email:string};
const GOOGLE_JWKS='https://www.googleapis.com/oauth2/v3/certs';
let cached:{until:number;keys:Record<string,unknown>[]} | null=null;

function bad():never{throw new CustomerAuthError('Invalid Google sign-in.',401)}
function parseBase64Url(part:string):Record<string,unknown>{
  if(!/^[A-Za-z0-9_-]+$/.test(part)||part.length>9000)bad();
  try{
    const data:unknown=JSON.parse(Buffer.from(part,'base64url').toString('utf8'));
    if(!data||typeof data!=='object'||Array.isArray(data))bad();
    return data as Record<string,unknown>;
  }catch{return bad()}
}
async function googleKeys(fetcher:typeof fetch):Promise<Record<string,unknown>[]>{
  if(cached&&cached.until>Date.now())return cached.keys;
  const response=await fetcher(GOOGLE_JWKS,{cache:'no-store',signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw new CustomerAuthError('Google verification temporarily unavailable.',503);
  const value:unknown=await response.json();
  if(!value||typeof value!=='object'||!('keys'in value)||
     !Array.isArray((value as {keys:unknown}).keys))bad();
  const keys=(value as {keys:unknown[]}).keys.filter((v):v is Record<string,unknown>=>
    !!v&&typeof v==='object'&&!Array.isArray(v) &&
    (v as Record<string,unknown>).kty==='RSA' &&
    typeof (v as Record<string,unknown>).kid==='string');
  if(!keys.length)throw new CustomerAuthError('Google verification temporarily unavailable.',503);
  // Google rotates keys; always bound the local cache lifetime.
  cached={until:Date.now()+Math.min(600_000,300_000),keys};
  return keys;
}
export async function verifyGoogleIdToken(
  raw:unknown,clientId:string,expectedNonce:unknown,fetcher:typeof fetch=fetch,
):Promise<GoogleProfile>{
  if(typeof raw!=='string'||raw.length>12000||raw.length<200||
     typeof expectedNonce!=='string'||!/^[A-Za-z0-9_-]{24,100}$/.test(expectedNonce)||
     !clientId.endsWith('.apps.googleusercontent.com'))bad();
  const sections=raw.split('.');
  if(sections.length!==3)bad();
  const header=parseBase64Url(sections[0]);
  const payload=parseBase64Url(sections[1]) as JwtClaims;
  if(header.alg!=='RS256'||header.typ&&header.typ!=='JWT'||typeof header.kid!=='string')bad();
  const now=Math.floor(Date.now()/1000);
  if(!['accounts.google.com','https://accounts.google.com'].includes(String(payload.iss))||
     payload.aud!==clientId||payload.azp&&payload.azp!==clientId||
     typeof payload.exp!=='number'||payload.exp<=now||
     typeof payload.iat!=='number'||payload.iat>now+120||
     payload.nonce!==expectedNonce||payload.email_verified!==true||
     typeof payload.sub!=='string'||!/^[A-Za-z0-9_-]{6,255}$/.test(payload.sub)||
     typeof payload.email!=='string'||payload.email.length>254||
     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))bad();
  const keys=await googleKeys(fetcher);
  const jwk=keys.find(k=>k.kid===header.kid && (k.alg===undefined||k.alg==='RS256')&&
    (k.use===undefined||k.use==='sig'));
  if(!jwk)bad();
  let valid=false;
  try{
    const key=createPublicKey({key:jwk as JsonWebKey,format:'jwk'});
    valid=verifySignature('RSA-SHA256',Buffer.from(sections[0]+'.'+sections[1]),
      key,Buffer.from(sections[2],'base64url'));
  }catch{return bad()}
  if(!valid)bad();
  return {subject:payload.sub,email:payload.email.trim().toLowerCase()};
}
export async function googleCustomerSession(
  pool:Pool,config:GoogleAuthConfig,idToken:unknown,nonce:unknown,fetcher:typeof fetch=fetch,
){
  if(!config.enabled||!config.clientId.endsWith('.apps.googleusercontent.com'))
    throw new CustomerAuthError('Google sign-in is not configured.',503);
  const profile=await verifyGoogleIdToken(idToken,config.clientId,nonce,fetcher);
  const client=await pool.connect();
  try{
    await client.query('BEGIN');
    // Serialize logins for one Google subject; no second account can be minted
    // by concurrent first-login callbacks.
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',['tuscanini:google:'+profile.subject]);
    const found=await client.query<{id:string;email:string}>(`
      SELECT a.id,a.email FROM tuscanini.customer_google_identities i
      JOIN tuscanini.customer_accounts a ON a.id=i.customer_id
      WHERE i.google_subject=$1`,[profile.subject]);
    let customer=found.rows[0];
    if(!customer){
      // Never attach a new Google identity to an existing email-only user
      // without that existing user's authenticated consent.
      const inserted=await client.query<{id:string;email:string}>(`
        INSERT INTO tuscanini.customer_accounts(email) VALUES($1)
        ON CONFLICT DO NOTHING RETURNING id,email`,[profile.email]);
      customer=inserted.rows[0];
      if(!customer)throw new CustomerAuthError('Account linking requires separate verification.',409);
      await client.query(`INSERT INTO tuscanini.customer_google_identities
        (google_subject,customer_id) VALUES($1,$2)`,[profile.subject,customer.id]);
    }
    const token=randomBytes(32).toString('base64url');
    const hashed=createHash('sha256').update(token).digest('hex');
    await client.query(`INSERT INTO tuscanini.customer_sessions
      (token_hash,customer_id,expires_at)
      VALUES($1,$2,now()+interval '30 days')`,[hashed,customer.id]);
    await client.query('COMMIT');
    return {token,customer};
  }catch(error){
    await client.query('ROLLBACK').catch(()=>{});
    throw error;
  }finally{client.release()}
}
