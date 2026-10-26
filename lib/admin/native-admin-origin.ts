import 'server-only';

/** Defend merchant settings and promotion mutations from same-site CSRF.
 * Admin cookie validation is handled by the Next proxy, independently. */
export function assertMerchantMutationOrigin(request:Request):void{
  const expected=new URL(request.url).origin;
  const origin=request.headers.get('origin');
  const referer=request.headers.get('referer');
  let actual=origin;
  if(!actual&&referer){
    try{actual=new URL(referer).origin}catch{actual=null}
  }
  if(actual!==expected)throw new Error('غير مسموح بتنفيذ إجراء إدارة من خارج الموقع.');
}
