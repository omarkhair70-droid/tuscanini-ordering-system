import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

/** A JWT is never an ownership assertion until Supabase Auth verifies it.
 * We never infer order ownership from a shared phone number or email string.
 */
export async function verifiedCustomerId(request: Request): Promise<string|null> {
  const header=request.headers.get('authorization')??'';
  if(!header)return null;
  const match=/^Bearer ([A-Za-z0-9._-]+)$/.exec(header);
  if(!match)throw new Error('CUSTOMER_SESSION_INVALID');
  const {data,error}=await getSupabaseServerAdminClient().auth.getUser(match[1]);
  if(error||!data.user?.id)throw new Error('CUSTOMER_SESSION_INVALID');
  return data.user.id;
}
