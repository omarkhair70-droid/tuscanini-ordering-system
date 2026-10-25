import { NextResponse } from 'next/server';
import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import { verifiedCustomerId } from '@/lib/orders/customer-auth';

export const dynamic = 'force-dynamic';
const headers = {'Cache-Control':'no-store, max-age=0'};

/** Authenticated first-party Supabase order history only. Never query by phone.
 * The dedicated Oracle/studio engines require their own verified owner
 * integration and must not be presented as part of this history.
 */
export async function GET(request: Request) {
  if(process.env.TUSCANINI_SUPABASE_CUSTOMER_ACCOUNTS_READY!=='yes')
    return NextResponse.json({message:'customer-account-database-not-ready'},{status:503,headers});
  let userId:string|null;
  try{userId=await verifiedCustomerId(request);}
  catch{return NextResponse.json({message:'invalid-session'},{status:401,headers});}
  if(!userId)return NextResponse.json({message:'sign-in-required'},{status:401,headers});
  try {
    const {data,error}=await getSupabaseServerAdminClient().from('orders')
      .select('id,order_number,placed_at,status,order_type,total_estimate')
      .eq('customer_user_id',userId).order('placed_at',{ascending:false}).limit(30);
    if(error)throw error;
    return NextResponse.json({orders:data??[]},{headers});
  } catch{
    return NextResponse.json({message:'history-temporarily-unavailable'}, {status:503,headers});
  }
}
