import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { SiteSettingsUpdatePayload } from '@/lib/admin/site-settings-validation';

export async function updateSiteSettingsSingletonOrThrow(payload: SiteSettingsUpdatePayload): Promise<void> {
  const supabase = getSupabaseServerAdminClient();

  const { data, error } = await supabase
    .from('site_settings')
    .update({
      is_ordering_open: payload.is_ordering_open,
      whatsapp_order_number: payload.whatsapp_order_number,
      phone_primary: payload.phone_primary,
      phone_secondary: payload.phone_secondary,
      address_ar: payload.address_ar,
      facebook_url: payload.facebook_url,
    })
    .eq('id', 1)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر حفظ إعدادات الموقع: ${error.message}`);
  }

  if (!data) {
    throw new Error('تعذر العثور على إعدادات الموقع (id=1) أثناء الحفظ.');
  }
}
