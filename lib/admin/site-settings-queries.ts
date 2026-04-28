import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

export type SiteSettingsView = {
  is_ordering_open: boolean;
  whatsapp_order_number: string;
  phone_primary: string;
  phone_secondary: string;
  address_ar: string;
  facebook_url: string;
  updated_at: string;
};

export async function getSiteSettingsSingletonOrThrow(): Promise<SiteSettingsView> {
  const supabase = getSupabaseServerAdminClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('is_ordering_open, whatsapp_order_number, phone_primary, phone_secondary, address_ar, facebook_url, updated_at')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر قراءة إعدادات الموقع: ${error.message}`);
  }

  if (!data) {
    throw new Error('لم يتم العثور على صف إعدادات الموقع (id=1).');
  }

  return {
    is_ordering_open: Boolean(data.is_ordering_open),
    whatsapp_order_number: typeof data.whatsapp_order_number === 'string' ? data.whatsapp_order_number : '',
    phone_primary: typeof data.phone_primary === 'string' ? data.phone_primary : '',
    phone_secondary: typeof data.phone_secondary === 'string' ? data.phone_secondary : '',
    address_ar: typeof data.address_ar === 'string' ? data.address_ar : '',
    facebook_url: typeof data.facebook_url === 'string' ? data.facebook_url : '',
    updated_at: typeof data.updated_at === 'string' ? data.updated_at : '',
  };
}
