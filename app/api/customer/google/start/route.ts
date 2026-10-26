import {NextRequest,NextResponse} from 'next/server';
import {GOOGLE_FLOW_COOKIE,GOOGLE_FLOW_OPTIONS,googleClientConfig,
  createGoogleFlow,encodeGoogleFlow,pkceChallenge} from '@/lib/customer-google-oauth';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
  const config=googleClientConfig(req.nextUrl.origin);
  if(!config)return NextResponse.redirect(new URL('/account?google=unavailable',req.nextUrl.origin));
  const flow=createGoogleFlow();
  const authorize=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorize.searchParams.set('client_id',config.clientId);
  authorize.searchParams.set('redirect_uri',config.redirectUri);
  authorize.searchParams.set('response_type','code');
  authorize.searchParams.set('scope','openid email profile');
  authorize.searchParams.set('state',flow.state);
  authorize.searchParams.set('nonce',flow.nonce);
  authorize.searchParams.set('code_challenge',pkceChallenge(flow.verifier));
  authorize.searchParams.set('code_challenge_method','S256');
  authorize.searchParams.set('prompt','select_account');
  const response=NextResponse.redirect(authorize,{status:302});
  response.headers.set('Cache-Control','no-store');
  response.headers.set('Referrer-Policy','no-referrer');
  response.cookies.set(GOOGLE_FLOW_COOKIE,encodeGoogleFlow(flow),GOOGLE_FLOW_OPTIONS);
  return response;
}
