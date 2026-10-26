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

/** The no-key map uses OpenStreetMap's documented embeddable view of the
 * Tolip/sports-club neighborhood. Tolip Inn's coordinates are published at
 * 29.06296 / 31.10091; this is NOT a geocoded Tuscanini doorway or pin.
 * Keep Google Maps directions address-driven until the merchant shares their
 * verified Place URL.
 */
export const tuscaniniUsingOsmEmbed = !/^[a-zA-Z0-9_-]{12,}$/.test(embedKey);
export const tuscaniniMapEmbedUrl = !tuscaniniUsingOsmEmbed
  ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedKey)}&q=${query}&language=ar&region=eg`
  : 'https://www.openstreetmap.org/export/embed.html?bbox=31.097%2C29.060%2C31.105%2C29.066&layer=mapnik';
