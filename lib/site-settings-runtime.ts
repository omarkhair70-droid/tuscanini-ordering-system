import 'server-only';

import { siteConfig } from '@/lib/site-config';
import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

export type PublicSiteSettings = {
  isOrderingOpen: boolean;
  whatsappOrderNumber: string;
  phonePrimary: string;
  phoneSecondary: string;
  addressAr: string;
  facebookUrl: string;
};

function getStaticFallbackSettings(): PublicSiteSettings {
  return {
    isOrderingOpen: true,
    whatsappOrderNumber: siteConfig.whatsappOrderNumber,
    phonePrimary: siteConfig.phonePrimary,
    phoneSecondary: siteConfig.phoneSecondary,
    addressAr: siteConfig.addressAr,
    facebookUrl: siteConfig.facebook,
  };
}

function normalizeSettingsWithFallback(raw: Record<string, unknown> | null | undefined): PublicSiteSettings {
  const fallback = getStaticFallbackSettings();

  if (!raw) {
    return fallback;
  }

  return {
    isOrderingOpen:
      typeof raw.is_ordering_open === 'boolean'
        ? raw.is_ordering_open
        : fallback.isOrderingOpen,
    whatsappOrderNumber:
      typeof raw.whatsapp_order_number === 'string' && raw.whatsapp_order_number.trim()
        ? raw.whatsapp_order_number
        : fallback.whatsappOrderNumber,
    phonePrimary:
      typeof raw.phone_primary === 'string' && raw.phone_primary.trim()
        ? raw.phone_primary
        : fallback.phonePrimary,
    phoneSecondary:
      typeof raw.phone_secondary === 'string' && raw.phone_secondary.trim()
        ? raw.phone_secondary
        : fallback.phoneSecondary,
    addressAr:
      typeof raw.address_ar === 'string' && raw.address_ar.trim()
        ? raw.address_ar
        : fallback.addressAr,
    facebookUrl:
      typeof raw.facebook_url === 'string' && raw.facebook_url.trim()
        ? raw.facebook_url
        : fallback.facebookUrl,
  };
}

export async function getRuntimePublicSiteSettings(): Promise<PublicSiteSettings> {
  const supabase = getSupabaseServerAdminClient();

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('is_ordering_open, whatsapp_order_number, phone_primary, phone_secondary, address_ar, facebook_url')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      return getStaticFallbackSettings();
    }

    return normalizeSettingsWithFallback(data as Record<string, unknown> | null);
  } catch {
    return getStaticFallbackSettings();
  }
}
