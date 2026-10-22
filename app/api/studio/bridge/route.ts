import { NextRequest, NextResponse } from 'next/server';
import { getLocalStudioOrigin, isLocalStudioRequest, studioOperatorAllowed } from '@/lib/studio-bridge';

export const runtime='nodejs';
export const dynamic='force-dynamic';

function result(data:unknown,status=200){return NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});}
function uuid(input:string|null):string|null {
  return input && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input) ? input : null;
}

async function relay(request:NextRequest):Promise<NextResponse>{
  const origin=getLocalStudioOrigin();
  if(!origin || !isLocalStudioRequest(request))return result({error:'Studio not available.'},404);
  const resource=request.nextUrl.searchParams.get('resource');
  const id=uuid(request.nextUrl.searchParams.get('orderId'));
  const method=request.method;
  let path:string,needsStaff=false,role:'cashier'|'kitchen'='cashier',body:unknown=undefined;
  if(method==='GET' && resource==='catalog')path='/api/studio/catalog';
  else if(method==='GET'&&resource==='inbox'){path='/api/staff/orders';needsStaff=true;}
  else if(method==='GET'&&resource==='track'&&id)path='/api/orders/'+id+'/tracking';
  else if(method==='GET'&&resource==='events'&&id)path='/api/orders/'+id+'/events';
  else if(method==='POST'&&resource==='create'){
    path='/api/orders';
    try{body=await request.json()}catch{return result({error:'Malformed order body.'},400);}
    if(!body||typeof body!=='object'||Array.isArray(body))return result({error:'Invalid order.'},400);
    const input=body as Record<string,unknown>;
    if(typeof input.requestKey!=='string'||!/^studio-[a-z0-9-]{12,80}$/i.test(input.requestKey)||
      !Array.isArray(input.items)||input.items.length>20)return result({error:'Invalid demo cart.'},400);
    // Only the sandbox database catalog decides prices. Never accept client prices.
    const valid=input.items.every(v=>!!v&&typeof v==='object'&&typeof v.sku==='string'&&
      /^[a-zA-Z0-9_-]{1,64}$/.test(v.sku)&&Number.isInteger(v.qty)&&v.qty>=1&&v.qty<=10);
    if(!valid)return result({error:'Invalid item quantity.'},400);
    body={requestKey:input.requestKey,items:input.items.map(v=>({sku:v.sku,qty:v.qty}))};
  } else if(method==='POST'&&resource==='action'&&id){
    needsStaff=true;
    let action:string;
    try{
      const data=await request.json() as {action?:unknown};
      action=typeof data.action==='string'?data.action:'';
    }catch{return result({error:'Invalid action.'},400);}
    if(action==='accept'||action==='reject')path='/api/staff/orders/'+id+'/decision';
    else if(action==='start'||action==='ready'){path='/api/kitchen/orders/'+id+'/progress';role='kitchen';}
    else if(action==='deliver')path='/api/staff/orders/'+id+'/handoff';
    else return result({error:'Unsupported action.'},400);
    body={action};
  }else return result({error:'Unknown demo operation.'},404);

  if(needsStaff&&!studioOperatorAllowed(request))return result({error:'Operator key required.'},403);
  try{
    const headers:Record<string,string>={};
    if(body!==undefined)headers['Content-Type']='application/json';
    if(needsStaff){
      headers['x-spike-test-token']=process.env.TUSCANINI_STUDIO_BRIDGE_TOKEN!;
      headers['x-spike-role']=role;
    }
    const upstream=await fetch(origin+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),
      cache:'no-store',signal:AbortSignal.timeout(8000)});
    const text=await upstream.text();
    // Only JSON data from our isolated loopback engine; never proxy HTML/errors/secrets.
    if(text.length>120_000)return result({error:'Studio reply too large.'},502);
    let parsed:unknown;
    try{parsed=JSON.parse(text)}catch{return result({error:'Studio is not responding correctly.'},502);}
    return result(parsed,upstream.status);
  }catch{return result({error:'Local studio engine is offline. Start npm run studio in its test database.'},503);}
}
export async function GET(request:NextRequest){return relay(request);}
export async function POST(request:NextRequest){return relay(request);}
