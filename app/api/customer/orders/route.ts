import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {callOracleCustomer,oracleAccountsEnabled,ORACLE_CUSTOMER_COOKIE,OracleOrderError} from '@/lib/oracle-order-api';
export const dynamic='force-dynamic';
export async function GET(){
  const headers={'Cache-Control':'no-store, max-age=0'};
  if(!oracleAccountsEnabled())return NextResponse.json({message:'customer-account-database-not-ready'},{status:503,headers});
  try{
    const token=(await cookies()).get(ORACLE_CUSTOMER_COOKIE)?.value;
    if(!token)return NextResponse.json({message:'sign-in-required'},{status:401,headers});
    return NextResponse.json(await callOracleCustomer('orders','GET',undefined,token),{headers});
  }catch(e){return NextResponse.json({message:'history-temporarily-unavailable'},
    {status:e instanceof OracleOrderError?e.status:503,headers});}
}
