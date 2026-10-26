import 'server-only';
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {oracleAccountsEnabled} from '@/lib/oracle-order-api';
export const GOOGLE_FLOW_COOKIE=process.env.NODE_ENV==='production'
  ?'__Host-tuscanini_google_flow':'tuscanini_google_flow';
export const GOOGLE_FLOW_OPTIONS={httpOnly:true,secure:process.env.NODE_ENV==='production',
  sameSite:'lax' as const,path:'/',maxAge:600};
export type GoogleFlow={state:string;nonce:string;verifier:string};
export function googleClientConfig(origin:string){
  if(!oracleAccountsEnabled())return null;
  const clientId=process.env.GOOGLE_OAUTH_CLIENT_ID??'';
  const secret=process.env.GOOGLE_OAUTH_CLIENT_SECRET??'';
  const raw=process.env.GOOGLE_OAUTH_REDIRECT_URI??'';
  let callback:URL;
  try{callback=new URL(raw)}catch{return null}
  if(!clientId.endsWith('.apps.googleusercontent.com')||secret.length<12||
     callback.pathname!=='/api/customer/google/callback'||
     callback.search||callback.hash||callback.username||callback.password||
     (callback.protocol!=='https:'&&!(process.env.NODE_ENV==='development'&&
       callback.hostname==='localhost'&&callback.protocol==='http:'))||
     callback.origin!==origin)return null;
  return {clientId,secret,redirectUri:callback.toString()};
}
export function createGoogleFlow():GoogleFlow{
  return {state:randomBytes(32).toString('base64url'),
    nonce:randomBytes(32).toString('base64url'),
    verifier:randomBytes(48).toString('base64url')};
}
export function encodeGoogleFlow(flow:GoogleFlow){
  return [flow.state,flow.nonce,flow.verifier].join('.');
}
export function decodeGoogleFlow(raw:unknown):GoogleFlow|null{
  if(typeof raw!=='string'||raw.length>270)return null;
  const [state,nonce,verifier,...rest]=raw.split('.');
  if(rest.length||!state||!nonce||!verifier||
     !/^[A-Za-z0-9_-]{42,44}$/.test(state)||
     !/^[A-Za-z0-9_-]{42,44}$/.test(nonce)||
     !/^[A-Za-z0-9_-]{60,70}$/.test(verifier))return null;
  return {state,nonce,verifier};
}
export function checkState(expected:string,received:unknown){
  if(typeof received!=='string'||received.length!==expected.length)return false;
  return timingSafeEqual(Buffer.from(expected),Buffer.from(received));
}
export function pkceChallenge(verifier:string){
  return createHash('sha256').update(verifier).digest('base64url');
}
