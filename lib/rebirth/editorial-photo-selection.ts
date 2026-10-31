import { tuscaniniFoodMedia } from '@/lib/rebirth/food-media';

/**
 * Strictly editorial source-photo selection.
 * No photo is a verified match for a named menu item.
 * Never use these records as product artwork/checkout evidence.
 */
export type MenuEditorialPhotograph = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
};

const photoById = (id: string) => tuscaniniFoodMedia.find(photo => photo.id === id);

const placements: Record<string, { id: string; title: string }> = {
  all: { id: 'TSC-07', title: 'الكريب من جوّه.' },
  crepe: { id: 'TSC-02', title: 'الكريب من جوّه.' },
  pizza: { id: 'TSC-10', title: 'البيتزا.' },
  sandwiches: { id: 'TSC-08', title: 'الساندوتشات.' },
};

export function getMenuEditorialPhotograph(family: string): MenuEditorialPhotograph | null {
  const key = family.startsWith('crepe-') ? 'crepe'
    : family.startsWith('pizza-') ? 'pizza'
      : family.startsWith('sandwiches-') ? 'sandwiches'
        : family;
  const placement = placements[key];
  if (!placement) return null;
  const photo = photoById(placement.id);
  if (!photo || photo.verifiedProductId !== null) return null;
  return {
    id: photo.id,
    src: photo.path,
    alt: photo.altAr,
    title: placement.title,
    caption: 'صورة حقيقية من توسكانيني · مش لصنف محدد',
  };
}
