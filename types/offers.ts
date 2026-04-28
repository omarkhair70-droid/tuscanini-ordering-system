export type Offer = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type PublicOffer = {
  id: string;
  titleAr: string;
  descriptionAr: string | null;
  badgeAr: string | null;
  priceText: string | null;
};

export type AdminOffer = PublicOffer & {
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
