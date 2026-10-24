import {NextResponse} from 'next/server';
import {
  oracleOrdersEnabled,operatorPasskeyAllowed,fetchOracleInbox,OracleOrderError,
} from '@/lib/oracle-order-api';

export const runtime='nodejs';
export const dynamic='force-dynamic';

/** Private connectivity proof; never return an order, phone, address or key. */
export async function GET(request:Request) {
  const headers={'Cache-Control':'private, no-store'};
  if(!operatorPasskeyAllowed(request))
    return NextResponse.json({ok:false,error:'Forbidden'},{status:403,headers});
  // Check connection even while live order routing is OFF: a read-only
  // test should not force activating checkout or hide the 20-ticket demo.
  const routingEnabled=oracleOrdersEnabled();
  try {
    const response=await fetchOracleInbox();
    if(!Array.isArray(response.orders))
      return NextResponse.json({ok:false,error:'Invalid order service response.'},{status:502,headers});
    return NextResponse.json({
      ok:true,backend:'oracle',connected:true,visibleOrders:response.orders.length,
      routingEnabled,acceptingOrders:'check-on-oracle', // Never claim intake is enabled from an inbox check.
    },{headers});
  }catch(error){
    return NextResponse.json({
      ok:false,error:error instanceof OracleOrderError?'Backend connection not ready.':'Connectivity check failed.',
    },{status:503,headers});
  }
}
