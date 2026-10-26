import {NextRequest,NextResponse} from 'next/server';
import {callOracleCustomer,ORACLE_CUSTOMER_COOKIE} from '@/lib/oracle-order-api';
import {GOOGLE_FLOW_COOKIE,GOOGLE_FLOW_OPTIONS,
  googleClientConfig,decodeGoogleFlow,checkState} from '@/lib/customer-google-oauth';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
  const config=googleClientConfig(req.nextUrl.origin);
  const flow=decodeGoogleFlow(req.cookies.get(GOOGLE_FLOW_COOKIE)?.value);
  const fail=(reason:string)=>{
    const response=NextResponse.redirect(new URL('/account?google='+reason,req.nextUrl.origin));
    response.cookies.set(GOOGLE_FLOW_COOKIE,'',{...GOOGLE_FLOW_OPTIONS,maxAge:0});
    response.headers.set('Cache-Control','no-store');
    response.headers.set('Referrer-Policy','no-referrer');
    return response;
  };
  if(!config)return fail('unavailable');
  const params=req.nextUrl.searchParams;
  if(!flow||!checkState(flow.state,params.get('state'))||params.has('error'))return fail('failed');
  const code=params.get('code');
  if(!code||code.length>2048)return fail('failed');
  try{
    const response=await fetch('https://oauth2.googleapis.com/token',{
      method:'POST',cache:'no-store',headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({code,client_id:config.clientId,
        client_secret:config.secret,redirect_uri:config.redirectUri,
        grant_type:'authorization_code',code_verifier:flow.verifier}),
      signal:AbortSignal.timeout(8000)});
    if(!response.ok)return fail('failed');
    const body:unknown=await response.json();
    if(!body||typeof body!=='object'||Array.isArray(body)||
       typeof (body as {id_token?:unknown}).id_token!=='string')return fail('failed');
    const verified=await callOracleCustomer('auth/google','POST',{
      idToken:(body as {id_token:string}).id_token,nonce:flow.nonce});
    if(typeof verified.token!=='string'||verified.token.length<40)return fail('failed');
    const done=NextResponse.redirect(new URL('/account',req.nextUrl.origin));
    done.headers.set('Cache-Control','no-store');
    done.headers.set('Referrer-Policy','no-referrer');
    done.cookies.set(GOOGLE_FLOW_COOKIE,'',{...GOOGLE_FLOW_OPTIONS,maxAge:0});
    done.cookies.set(ORACLE_CUSTOMER_COOKIE,verified.token,{
      httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',
      maxAge:30*24*60*60});
    return done;
  }catch{return fail('failed')}
}
