import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { ProductAvailability } from '@/lib/admin/menu-admin-validation';

export async function updateProductAvailabilityById(id: string, availability: ProductAvailability): Promise<void> {
  const supabase = getSupabaseServerAdminClient();

  const { data, error } = await supabase
    .from('products')
    .update({ availability })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر تحديث حالة التوفر: ${error.message}`);
  }

  if (!data) {
    throw new Error('المنتج المطلوب غير موجود.');
  }
}

export async function updateProductPriceFromById(id: string, priceFrom: number): Promise<void> {
  const supabase = getSupabaseServerAdminClient();

  const { data, error } = await supabase
    .from('products')
    .update({ price_from: priceFrom })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر تحديث السعر: ${error.message}`);
  }

  if (!data) {
    throw new Error('المنتج المطلوب غير موجود.');
  }
}

export async function updateProductIsActiveById(id: string, isActive: boolean): Promise<void> {
  const supabase = getSupabaseServerAdminClient();

  const { data, error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر تحديث حالة المنتج: ${error.message}`);
  }

  if (!data) {
    throw new Error('المنتج المطلوب غير موجود.');
  }
}

export async function updateProductSizePriceById(id: string, price: number): Promise<void> {
  const supabase = getSupabaseServerAdminClient();

  const { data, error } = await supabase
    .from('product_sizes')
    .update({ price })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر تحديث سعر الحجم: ${error.message}`);
  }

  if (!data) {
    throw new Error('الحجم المطلوب غير موجود.');
  }
}
