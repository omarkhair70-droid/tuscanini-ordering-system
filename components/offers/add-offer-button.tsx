'use client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';

export function AddOfferButton({ offerId, offerTitle, offerPrice }: { offerId: string; offerTitle: string; offerPrice: number }) {
  const { addOfferItem } = useCart();
  const router = useRouter();
  return <button type="button" className="mt-3 rounded-xl bg-brand-red px-3 py-2 text-sm font-black text-white" onClick={() => { addOfferItem({ offerId, offerTitle, unitPrice: offerPrice, quantity: 1 }); router.push('/cart'); }}>إضافة العرض للسلة</button>;
}
