import {NextRequest,NextResponse} from 'next/server';
import {callOracleCustomer,ORACLE_CUSTOMER_COOKIE,oracleAccountsEnabled,OracleOrderError} from '@/lib/oracle-order-api';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store, max-age=0'};
const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',
  sameSite:'lax' as const,path:'/',maxAge:30*24*60*60};
function failure(error:unknown){
  const status=error instanceof OracleOrderError?error.status:503;
  const message=status===401?'جلسة الدخول غير صالحة.':status===503?'حسابات العملاء مش متاحة دلوقتي.':'تعذّر تنفيذ طلبك.';
  return NextResponse.json({error:message},{status,headers});
}
function originAllowed(req:NextRequest){
  const origin=req.headers.get('origin');
  return !!origin&&origin===req.nextUrl.origin;
}
const currentToken=(req:NextRequest)=>req.cookies.get(ORACLE_CUSTOMER_COOKIE)?.value;
export async function GET(req:NextRequest){
  if(!oracleAccountsEnabled())return NextResponse.json({error:'حسابات العملاء مش متاحة دلوقتي.'},{status:503,headers});
  const action=req.nextUrl.searchParams.get('resource')??'session';
  if(!['session','addresses','orders'].includes(action))
    return NextResponse.json({error:'Not found'},{status:404,headers});
  try{
    const path=action==='session'?'auth/session':action;
    const result=await callOracleCustomer(path,'GET',undefined,currentToken(req));
    return NextResponse.json(result,{headers});
  }catch(error){return failure(error);}
}
export async function POST(req:NextRequest){
  if(!originAllowed(req))return NextResponse.json({error:'Origin required'},{status:403,headers});
  if(!oracleAccountsEnabled())return NextResponse.json({error:'حسابات العملاء مش متاحة دلوقتي.'},{status:503,headers});
  const action=req.nextUrl.searchParams.get('action');
  if(!['request','verify','logout','save-address'].includes(action??''))
    return NextResponse.json({error:'Not found'},{status:404,headers});
  const body=await req.text().catch(()=>'');
  if(body.length>2500)return NextResponse.json({error:'Request too large'},{status:413,headers});
  let payload:Record<string,unknown>;
  try{payload=JSON.parse(body) as Record<string,unknown>;}catch{return NextResponse.json({error:'Invalid JSON'},{status:400,headers});}
  if(!payload||typeof payload!=='object'||Array.isArray(payload))
    return NextResponse.json({error:'Invalid request'},{status:400,headers});
  try{
    if(action==='request'){
      await callOracleCustomer('auth/request','POST',{email:payload.email});
      return NextResponse.json({ok:true},{headers});
    }
    if(action==='verify'){
      const result=await callOracleCustomer('auth/verify','POST',{email:payload.email,code:payload.code});
      if(typeof result.token!=='string'||!result.customer)return NextResponse.json({error:'تعذّر الدخول.'},{status:503,headers});
      const response=NextResponse.json({customer:result.customer},{headers});
      response.cookies.set(ORACLE_CUSTOMER_COOKIE,result.token,cookieOptions);
      return response;
    }
    if(action==='logout'){
      const token=currentToken(req);
      if(token)await callOracleCustomer('auth/logout','POST',{},token).catch(()=>{});
      const response=NextResponse.json({ok:true},{headers});
      response.cookies.set(ORACLE_CUSTOMER_COOKIE,'',{...cookieOptions,maxAge:0});
      return response;
    }
    return NextResponse.json(await callOracleCustomer('addresses','POST',payload,currentToken(req)),{headers});
  }catch(error){return failure(error);}
}
export async function DELETE(req:NextRequest){
  if(!originAllowed(req))return NextResponse.json({error:'Origin required'},{status:403,headers});
  if(!oracleAccountsEnabled())return NextResponse.json({error:'Unavailable'},{status:503,headers});
  const id=req.nextUrl.searchParams.get('id')??'';
  if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:'Invalid address'},{status:400,headers});
  try{return NextResponse.json(await callOracleCustomer('addresses/'+id,'DELETE',undefined,currentToken(req)),{headers});}
  catch(error){return failure(error);}
}
