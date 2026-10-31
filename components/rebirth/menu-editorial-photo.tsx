import Image from 'next/image';
import type { MenuEditorialPhotograph } from '@/lib/rebirth/editorial-photo-selection';

/**
 * A deliberate break in the menu *after* real food choices.
 * The image is a restaurant-category document, not a SKU image or offer.
 * Purely presentational, with no effect on the catalog or order state.
 */
export function MenuEditorialPhoto({ photo }: { photo: MenuEditorialPhotograph }) {
  return (
    <figure className="t-menu-photo-break" data-editorial-photo-id={photo.id}>
      <div className="t-menu-photo-break__image">
        <Image src={photo.src} alt={photo.alt} fill
          sizes="(max-width: 720px) 62vw, (max-width: 1050px) 46vw, 560px"
          loading="lazy" />
      </div>
      <figcaption className="t-menu-photo-break__caption">
        <span className="t-menu-photo-break__eyebrow">من مطبخ توسكانيني</span>
        <strong>{photo.title}</strong>
        <span className="t-menu-photo-break__source">{photo.caption}</span>
      </figcaption>
    </figure>
  );
}
