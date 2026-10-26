'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';

export function RebirthOfferAction({ id, title, price }: { id:string;title:string;price:number }) {
  const router=useRouter();
  const { addOfferItem }=useCart();
  const valid=Number.isFinite(price) && price>=0;
  return <button type="button" className="t-offers__add" disabled={!valid} onClick={()=>{
    if(!valid)return;
    addOfferItem({offerId:id,offerTitle:title,unitPrice:price,quantity:1});
    router.push('/cart');
  }}>ضيف العرض للسلة ↗</button>;
}
