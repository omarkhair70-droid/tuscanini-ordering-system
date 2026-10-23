import {NextResponse} from 'next/server';
import {oracleOrdersEnabled,operatorPasskeyAllowed,publishCurrentCatalogToOracle,OracleOrderError} from '@/lib/oracle-order-api';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function POST(request:Request){
  const headers={'Cache-Control':'no-store'};
  if(!oracleOrdersEnabled())return NextResponse.json({error:'Unavailable'},{status:404,headers});
  if(!operatorPasskeyAllowed(request))return NextResponse.json({error:'Forbidden'},{status:403,headers});
  try{
    const saved=await publishCurrentCatalogToOracle();
    return NextResponse.json({ok:true,...saved,notice:'Preview menu snapshot synchronized; owner approval still required for launch.'},{headers});
  }catch(error){
    const status=error instanceof OracleOrderError?error.status:503;
    return NextResponse.json({error:'Catalog sync unavailable.'},{status,headers});
  }
}
