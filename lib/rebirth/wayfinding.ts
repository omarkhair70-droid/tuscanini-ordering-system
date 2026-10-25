/** Shared public navigation to Tuscanini's merchant-supplied STREET ADDRESS.
 * This is an address lookup, never a fabricated precise GPS/business pin.
 * If the merchant supplies a verified Google Place link, set the public URL
 * override (not arbitrary client input) for the canonical destination.
 */
const address = 'شارع البحر سور نادي توليب أمام النادي الرياضي، بني سويف، مصر';
const query = encodeURIComponent(address);

const verifiedPlaceUrl = process.env.NEXT_PUBLIC_TUSCANINI_VERIFIED_MAPS_URL ?? '';
const isTrustedMapsUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (
      ['google.com','www.google.com','maps.google.com','maps.app.goo.gl'].includes(url.hostname)
    );
  } catch { return false; }
};

export const tuscaniniMapSearchUrl =
  isTrustedMapsUrl(verifiedPlaceUrl) ? verifiedPlaceUrl :
  `https://www.google.com/maps/search/?api=1&query=${query}`;

export const tuscaniniDirectionsUrl =
  isTrustedMapsUrl(verifiedPlaceUrl) ? verifiedPlaceUrl :
  `https://www.google.com/maps/dir/?api=1&destination=${query}`;

const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY ?? '';

/** Use Google's documented, key-based Embed API when configured; otherwise
 * show a lightweight address-search embed with a working external link beside it.
 * The external route always works independently of iframe availability.
 */
export const tuscaniniMapEmbedUrl = /^[a-zA-Z0-9_-]{12,}$/.test(embedKey)
  ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedKey)}&q=${query}&language=ar&region=eg`
  : `https://maps.google.com/maps?q=${query}&hl=ar&z=16&output=embed`;
